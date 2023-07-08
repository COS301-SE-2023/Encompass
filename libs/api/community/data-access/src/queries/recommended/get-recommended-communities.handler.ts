import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedCommunitiesQuery } from "./get-recommended-communities.query";
import { CommunityEntityRepository } from "../../db/community-entity.repository"
import { HttpService } from "@nestjs/axios";
import { all } from "axios";

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
            const recommendedCommunities = [];
            if(userCount <= 3){
                //recommend just by categories
                //loop through all communities and order them by how many categories they have in common with the user
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
                /*for(let i = 0; i < recommendedCommunities.length; i++){
                    recommendedCommunities[i] = recommendedCommunities[i].community;
                }*/
            } else if (userCount > 3) {
                console.log("3NN algo");
                //K means clustering profiles where K==3
                
                const profiles = []
                const categories = ["Movies","Mathematics","Action","Science-Fiction","Drama","Romance","Anime","Books","Hospitality","Animation","Documentary","Physics","Geography","Series","Western","Mystery","Fantasy","Life Science","War","Information-Technology","Arts","Business","Musical","Horror","Adventure","History","Comedy"];
                const following = [];
                const events = [];
                const tempProfile = [];

                //add events from all profiles to events array
                for(let i = 0; i < allProfiles?.data.length; i++){
                    for(let j = 0; j < allProfiles?.data[i].events?.length; j++){
                        events.push(allProfiles?.data[i].events[j]);
                    }
                }

                for(let i = 0; i < allProfiles?.data.length; i++){
                    //for each category add 0 or one to tempProfile if profile has category
                    for(let j = 0; j < categories?.length; j++){
                        if(allProfiles?.data[i].categories?.includes(categories[j])){
                            tempProfile.push(1);
                        } else {
                            tempProfile.push(0);
                        }
                    }
                    //for each profile add 0 or 1 to tempProfile if profile is following user
                    for(let j = 0; j < allProfiles?.data[i].length; j++){
                        let comparedUsers = 0;
                        while(comparedUsers < userCount){
                            if(allProfiles?.data[i].following[j] == allProfiles?.data[comparedUsers]._id){
                                tempProfile.push(1);
                            } else {
                                tempProfile.push(0);
                            }
                            comparedUsers++;
                        }
                    }

                    //for each event add 0 or 1 to tempProfile if profile is attending event
                    for(let j = 0; j < events.length; j++){
                        let comparedEvents = 0;
                        while(comparedEvents < userCount){
                            if(allProfiles?.data[i].events[j] == events[j]){
                                tempProfile.push(1);
                            } else if( allProfiles?.data[i].events[j] != events[j] || allProfiles?.data[i].events[j] == null ){
                                tempProfile.push(0);
                            }
                            comparedEvents++;
                        }
                        console.log(allProfiles?.data[i].events[j]);
                    }
                    
                    profiles.push(tempProfile);
                }
                console.log(profiles);
            }
            
        } catch (e) {
            console.log(e)
        }
        console.log(userId)

        return this.communityEntityRepository.findCommunitiesByUserId(userId);
    }
}