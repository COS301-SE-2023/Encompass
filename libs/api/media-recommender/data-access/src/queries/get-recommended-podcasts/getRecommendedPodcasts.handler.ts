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
        type Category = { category: string[]; score: number};
        type usedCategory = { category: string; score: number};

        try {
            const currentUserProfilePromise = this.httpService.get(url + "/api/profile/get/" + userId).toPromise();
            const recommendedUsersPromise = this.httpService.get(url + "/api/profile/get-recommended/" + userId).toPromise();
            const [currentUserProfile, recommendedUsers] = await Promise.all([currentUserProfilePromise, recommendedUsersPromise]);
            let allPodcasts;
            if (recommendedUsers?.data.length < 1) {

                //get 10 and do a KNN on them then return top two
                //if convertuserCategories returns null set categories to empty array
                const categories: Category[] = convertUserCategories(currentUserProfile?.data);
                const rankedCategories: string[] = rank(categories);
                allPodcasts = await this.podcastEntityRepository.findSome(rankedCategories);
            } else {
                //get all categories from recommended users
                const recommendedUsersCategories: Category[] = recommendedUsers?.data.map((user: any) => convertUserCategories(user));
                const categories: Category[] = [...new Set(recommendedUsersCategories.flat())];
                
                const rankedCategories: string[] = rank(categories);
                allPodcasts = await this.podcastEntityRepository.findSome(rankedCategories);
            }

            return allPodcasts;
        } catch (error) {
            console.log(error);
            return [];
        }

        function rank( categories: Category[] ) {
            //rank categories by cumulative score,
            //where cumulative score is sum of all scores where the category appears in the category array
            const rankedCategories: usedCategory[] = [];
            categories.forEach((category: Category) => {
                category.category.forEach((categoryName: string) => {
                    const index = rankedCategories.findIndex((rankedCategory: usedCategory) => rankedCategory.category === categoryName);
                    if (index === -1) {
                        rankedCategories.push({ category: categoryName, score: category.score });
                    } else {
                        rankedCategories[index].score += category.score;
                    }
                });
            });
            //sort ranked categories by score
            rankedCategories.sort((a: usedCategory, b: usedCategory) => b.score - a.score);
            //take top 8 categories
            rankedCategories.splice(8);
            
            //pick random 2 categories from top 8
            const randomCategories: string[] = [];
            while (randomCategories.length < 2) {
                const randomIndex = Math.floor(Math.random() * rankedCategories.length);
                if (!randomCategories.includes(rankedCategories[randomIndex].category)) {
                    randomCategories.push(rankedCategories[randomIndex].category);
                }
            }
            return randomCategories;
        }

        function convertUserCategories( currentUserProfile: any ) {
            if (currentUserProfile.categories) {
                const updatedProfile: Category[] = [];
                currentUserProfile.categories.forEach((category: any) => {
                    if (categoryMappings[category.category]&&categoryMappings[category.category].podcasts.length > 0) {
                        //add podcastcategory identified by current user profile as key to categorymappings,
                        //to updatedProfile with score from currentUserprofile
                        updatedProfile.push({ category: categoryMappings[category.category].podcasts, score: category.score });
                    }
                });
                return updatedProfile;
            } else {
                return [];
            }
            
        }
    }
}