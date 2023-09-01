import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedPodcastsQuery } from "./getRecommendedPodcasts.query";
import { HttpService } from "@nestjs/axios";
import { categoryMappings } from '../categoryMappings';
import { PodcastEntityRepository } from "../../db/podcast-db/podcast-entity.repository";


@QueryHandler(GetRecommendedPodcastsQuery)
export class GetRecommendedPodcastsHandler implements IQueryHandler<GetRecommendedPodcastsQuery> {
    constructor(
        private readonly podcastEntityRepository: PodcastEntityRepository,
        private readonly httpService: HttpService,
    ) {}

    async execute({ userId }: GetRecommendedPodcastsQuery) {
        const url = process.env["BASE_URL"];

        try {
            //const currentUserProfilePromise = this.httpService.get(url + "/api/profile/get/" + userId).toPromise();
            //const recommendedUsersPromise = this.httpService.get(url + "/api/profile/get-recommended/" + userId).toPromise();
            //const [currentUserProfile, recommendedUsers] = await Promise.all([currentUserProfilePromise, recommendedUsersPromise]);
        
            /*if (recommendedUsers?.data.length < 1) {

                //get 10 and do a KNN on them then return top two
                //const categories = convertUserCategories(currentUserProfile?.data);
                //const allMovies = await this.podcastEntityRepository.findSome(categories);
            }*/

            return this.podcastEntityRepository.findAllCategories();
        } catch (error) {
            console.log(error);
            return [];
        }

        /*function convertUserCategories( currentUserProfile: any ) {
            const updatedProfile: string[] = [];
            currentUserProfile.categories.forEach((category: any) => {
                if (categoryMappings[category]) {
                    updatedProfile.push(...categoryMappings[category].podcasts);
                } else {
                    updatedProfile.push(category);
                }
            });
            currentUserProfile.categories = updatedProfile;
            return updatedProfile;
        }*/
    }
}