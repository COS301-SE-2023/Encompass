import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetPopularPostsQuery } from "./getPopularPosts.query";
import { PostDtoRepository } from "../../db/post-dto.repository";
import { PostSchema } from "../../db/post.schema";
import { HttpService } from "@nestjs/axios";

@QueryHandler(GetPopularPostsQuery)
export class GetPopularPostsHandler implements IQueryHandler<GetPopularPostsQuery>{
    constructor(
        private readonly postDtoRepository: PostDtoRepository,
        private readonly httpService: HttpService,
    ){}

    async execute({ username }: GetPopularPostsQuery) {
        const url = process.env["BASE_URL"];
        try {
            const currentUser = await this.httpService.get(`${url}/api/profile/get-user/${username}`).toPromise();
            const currentUserData = currentUser?.data;
            const currentUserCommunities: string[] = currentUserData?.communities;
            const allPosts = await this.postDtoRepository.getAllowedPosts(currentUserCommunities);
            const popularPosts = orderbyPopularity(allPosts);
            return popularPosts;
        } catch (error) {
            return [];
        }

        function orderbyPopularity(postsNotByUser: PostSchema[]) {
            const popularity: number[] = [];

            postsNotByUser.forEach(post => {
                const { shares, comments, likes } = post;
                const shareWeight = 1;
                const commentWeight = 1.2;
                const likeWeight = 0.8;
                const popularityUnit = shares * shareWeight + comments * commentWeight + likes.length * likeWeight;
                popularity.push(popularityUnit);
            });

            //create new PostSchema array which is a deep copy of postsNotByUser
            const postsNotByUserCopy: PostSchema[] = JSON.parse(JSON.stringify(postsNotByUser));
            
            //order posts by popularity descending
            const orderedPosts = postsNotByUserCopy.sort((a, b) => {
                const indexA = postsNotByUserCopy.indexOf(a);
                const indexB = postsNotByUserCopy.indexOf(b);
                return popularity[indexB] - popularity[indexA];
            });
            return orderedPosts;
        }
    }

    
}
