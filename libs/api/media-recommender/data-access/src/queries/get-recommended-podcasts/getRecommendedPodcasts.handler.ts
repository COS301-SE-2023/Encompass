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
            const currentUserProfilePromise = this.httpService.get(url + "/api/profile/get/" + userId).toPromise();
            const recommendedUsersPromise = this.httpService.get(url + "/api/profile/get-recommended/" + userId).toPromise();
            const [currentUserProfile, recommendedUsers] = await Promise.all([currentUserProfilePromise, recommendedUsersPromise]);
            let allPodcasts;
            if (recommendedUsers?.data.length < 1) {

                //get 10 and do a KNN on them then return top two
                //if convertuserCategories returns null set categories to empty array
                const categories = convertUserCategories(currentUserProfile?.data);
                allPodcasts = await this.podcastEntityRepository.findSome(categories);
            } else {
                //get all categories from recommended users
                const recommendedUsersCategories: string[] = recommendedUsers?.data.map((user: any) => convertUserCategories(user));
                const categories: string[] = [...new Set(recommendedUsersCategories.flat())];
                allPodcasts = await this.podcastEntityRepository.findSome(categories);
            }

            return allPodcasts;
        } catch (error) {
            console.log(error);
            return [];
        }

        function convertUserCategories( currentUserProfile: any ) {
            if (currentUserProfile.categories) {
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
            } else {
                return [];
            }
            
        }
    }
}