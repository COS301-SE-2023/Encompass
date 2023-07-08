import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedCommunitiesQuery } from "./get-recommended-communities.query";
import { CommunityEntityRepository } from "../../db/community-entity.repository"
import { HttpService } from "@nestjs/axios";

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
                for(let i = 0; i < recommendedCommunities.length; i++){
                    recommendedCommunities[i] = recommendedCommunities[i].community;
                }
            }/* else if (userCount > 3) {
                
            }*/
            
        } catch (e) {
            console.log(e)
        }
        console.log(userId)

        return this.communityEntityRepository.findCommunitiesByUserId(userId);
    }
}