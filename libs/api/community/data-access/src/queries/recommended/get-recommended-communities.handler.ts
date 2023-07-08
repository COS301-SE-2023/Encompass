import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedCommunitiesQuery } from "./get-recommended-communities.query";
import { CommunityEntityRepository } from "../../db/community-entity.repository"
import { HttpService } from "@nestjs/axios";
import { all } from "axios";
import { CommunityDto } from "../../community.dto";

@QueryHandler(GetRecommendedCommunitiesQuery)
export class GetRecommendedCommunitiesHandler implements IQueryHandler<GetRecommendedCommunitiesQuery> {
    constructor(
        private readonly communityEntityRepository: CommunityEntityRepository,
        private readonly httpService: HttpService
    ){}

    
    async execute({ userId }: GetRecommendedCommunitiesQuery){
        const communities = await this.communityEntityRepository.findCommunitiesByUserId(userId);
        //put an if statement here to check if there is more than one community the user is not in
        const url = process.env["BASE_URL"];
        try{
            const allProfiles = await this.httpService.get(url + "api/profile/get-all").toPromise();  //array of profile objects
            const userCount = allProfiles?.data?.length;
            const currentUserProfile = await this.httpService.get(url + "api/profile/get/" + userId).toPromise();
            const currentUserCategories = currentUserProfile?.data?.categories;  //array of categories as strings
            const recommendedCommunities: {community: CommunityDto, count: number}[] = [];
            let finalRecommendedCommunities: CommunityDto[] = [];
            if(userCount <= 3){
                finalRecommendedCommunities = coldStart(currentUserCategories, recommendedCommunities); //test this
            } else if (userCount > 3) {
                const profiles = setupUserArrays(allProfiles);
                //K means clustering profiles where K==3
                //get 3 random profiles
                const randomProfiles = [];
                for(let i = 0; i < 3; i++){
                    const randomIndex = Math.floor(Math.random() * profiles.length);
                    randomProfiles.push(profiles[randomIndex]);
                    profiles.splice(randomIndex, 1);
                }
                
                console.log(profiles);
            }
            
        } catch (e) {
            console.log(e)
        }
        console.log(userId);

        function coldStart(currentUserCategories: string[], recommendedCommunities: {community: CommunityDto, count: number}[]) {
            //recommend just by categories
            //loop through all communities and order them by how many categories they have in common with the user
            const result = [];
            for(let i = 0; i < communities.length; i++){
                const communityCategories = communities[i].categories;
                let count = 0;
                for(let j = 0; j < communityCategories.length; j++){
                    if(currentUserCategories.includes(communityCategories[j])){
                        count++;
                    }
                }
                recommendedCommunities.push({community: communities[i], count: count});
            }
            recommendedCommunities.sort((a, b) => (a.count > b.count) ? -1 : 1);
            
            //remove count: and community: from each object in the array
            for(let i = 0; i < recommendedCommunities.length; i++){
                result.push(recommendedCommunities[i].community);
            }
            return result;
        }

        function setupUserArrays( allProfiles: any) {
            const profiles = [];
            const categories: string[] = [];
            const following: string[] = [];
            const events: string[] = [];
            const tempProfile = [];

            //add categories from all profiles to categories array, categories array must have unique values
            for(let i = 0; i < allProfiles?.data.length; i++){
                for(let j = 0; j < allProfiles?.data[i].categories?.length; j++){
                    if(categories.length < 1 || !categories.includes(allProfiles?.data[i].categories[j])){
                        categories.push(allProfiles?.data[i].categories[j]);
                    }
                }
            }

            //add following from all profiles to following array, following array must have unique values
            for(let i = 0; i < allProfiles?.data.length; i++){
                for(let j = 0; j < allProfiles?.data[i].following?.length; j++){
                    if(following.length < 1 || !following.includes(allProfiles?.data[i].following[j])){
                        following.push(allProfiles?.data[i].following[j]);
                    }
                }
            }
            //console.log("following: ", following);

            //add events from all profiles to events array, events array must have unique values
            for(let i = 0; i < allProfiles?.data.length; i++){
                for(let j = 0; j < allProfiles?.data[i].events?.length; j++){
                    if(events.length < 1 || !events.includes(allProfiles?.data[i].events[j])){
                        events.push(allProfiles?.data[i].events[j]);
                    }
                }
            }
            //console.log("events: ", events);

            for(let i = 0; i < allProfiles?.data.length; i++){
                tempProfile.length = 0;
                //for each category add 0 or one to tempProfile if profile has category
                for(let j = 0; j < categories?.length; j++){
                    if(allProfiles?.data[i].categories?.includes(categories[j])){
                        tempProfile.push(1);
                    } else {
                        tempProfile.push(0);
                    }
                }
                //for each profile add 0 or 1 to tempProfile if profile is following user
                for(let j = 0; j < following.length; j++){
                    if(allProfiles?.data[i].following?.includes(following[j])){
                        tempProfile.push(1);
                    } else {
                        tempProfile.push(0);
                    }
                }
                //for each event add 0 or 1 to tempProfile if profile is attending event
                for(let j = 0; j < events.length; j++){
                    if(allProfiles?.data[i].events?.includes(events[j])){
                        tempProfile.push(1);
                    } else {
                        tempProfile.push(0);
                    }
                }
                //console.log("tempProfile: ", tempProfile);
                profiles.push({ profile: tempProfile});
            }
            return profiles;
        }
        return this.communityEntityRepository.findCommunitiesByUserId(userId);
    }
}