import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedCommunitiesQuery } from "./get-recommended-communities.query";
import { CommunityEntityRepository } from "../../db/community-entity.repository"
import { HttpService } from "@nestjs/axios";
import { CommunityDto } from "../../community.dto";

@QueryHandler(GetRecommendedCommunitiesQuery)
export class GetRecommendedCommunitiesHandler implements IQueryHandler<GetRecommendedCommunitiesQuery> {
    constructor(
        private readonly communityEntityRepository: CommunityEntityRepository,
        private readonly httpService: HttpService
    ){}

    
    async execute({ userId }: GetRecommendedCommunitiesQuery) {
        const communitiesUserIsNotIn = await this.communityEntityRepository.findCommunitiesByUserId(userId);
        //put an if statement here to check if there is more than one community the user is not in
        if( communitiesUserIsNotIn == undefined ){
            return [];
        } else if(communitiesUserIsNotIn.length <= 1){
            return communitiesUserIsNotIn;
        }

        //define types for the following variables
        type communityType = { community: CommunityDto, count: number };

        const url = process.env["BASE_URL"];
        try{
           
            const [allProfiles, currentUserProfile, recommendedUsers] = await Promise.all([
                this.httpService.get(url + "/api/profile/get-all").toPromise(),  //array of profile objects
                this.httpService.get(url + "/api/profile/get/" + userId).toPromise(),
                this.httpService.get(url + "/api/profile/get-recommended/" + userId).toPromise()
            ]);
            const allProfilesData = allProfiles?.data;
            const currentUserProfileData = currentUserProfile?.data;
            const recommendedUsersData = recommendedUsers?.data;
            const userCount = allProfilesData?.length;
            const currentUserCategories = currentUserProfileData?.categories;  //array of categories as strings
            const recommendedCommunities: communityType[] = [];
            let finalRecommendedCommunities: CommunityDto[] = [];
            if(userCount <= 3){
                finalRecommendedCommunities = coldStart(currentUserCategories, recommendedCommunities); //test this
            } else if (userCount > 3) {
                //get recommended users ids
                const recommendedUsersIds = recommendedUsersData.map((user: { _id: string; }) => user._id);
                //find communities recommended users are in from communitiesUserIsNotIn const
                const recommendedUsersCommunities: any[] = [];
                for(let i = 0; i < recommendedUsersIds.length; i++){
                    for(let j = 0; j < communitiesUserIsNotIn.length; j++){
                        if(communitiesUserIsNotIn[j].members.includes(recommendedUsersIds[i]) || (communitiesUserIsNotIn[j].admin.includes(recommendedUsersIds[i]))){
                            //only push the community if it is not already in the array
                            if(!recommendedUsersCommunities.includes(communitiesUserIsNotIn[j])){
                                recommendedUsersCommunities.push(communitiesUserIsNotIn[j]);
                            }
                        }
                    }
                }

                //order the communities by the number of recommended users in them
                const recommendedUsersCommunitiesWithCount = [];
                for(let i = 0; i < recommendedUsersCommunities.length; i++){
                    const communityMembers = recommendedUsersCommunities[i].members;
                    const communityAdmin = recommendedUsersCommunities[i].admin;
                    let count = 0;
                    for(let j = 0; j < recommendedUsersIds.length; j++){
                        if(communityMembers.includes(recommendedUsersIds[j]) || communityAdmin.includes(recommendedUsersIds[j])){
                            count++;
                        }
                    }
                    recommendedUsersCommunitiesWithCount.push({community: recommendedUsersCommunities[i], count: count});
                }
                recommendedUsersCommunitiesWithCount.sort((a, b) => (a.count > b.count) ? -1 : 1);
                //remove count: and community: from each object in the array
                for(let i = 0; i < recommendedUsersCommunitiesWithCount.length; i++){
                    finalRecommendedCommunities.push(recommendedUsersCommunitiesWithCount[i].community);
                }
            }
            return finalRecommendedCommunities;
        } catch (e) {
            console.log(e);
            return [];
        }

        function coldStart(currentUserCategories: string[], recommendedCommunities: communityType[]) {
            //recommend just by categories
            //loop through all communities and order them by how many categories they have in common with the user
            const result = [];
            for(let i = 0; i < communitiesUserIsNotIn.length; i++){
                const communityCategories = communitiesUserIsNotIn[i].categories;
                let count = 0;
                for(let j = 0; j < communityCategories.length; j++){
                    if(currentUserCategories.includes(communityCategories[j])){
                        count++;
                    }
                }
                recommendedCommunities.push({community: communitiesUserIsNotIn[i], count: count});
            }
            recommendedCommunities.sort((a, b) => (a.count > b.count) ? -1 : 1);
            
            //remove count: and community: from each object in the array
            for(let i = 0; i < recommendedCommunities.length; i++){
                result.push(recommendedCommunities[i].community);
            }
            return result;
        }
    }
}