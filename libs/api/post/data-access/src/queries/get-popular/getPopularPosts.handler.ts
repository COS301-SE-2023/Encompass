import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetPopularPostsQuery } from "./getPopularPosts.query";
import { PostDtoRepository } from "../../db/post-dto.repository";
import { PostSchema } from "../../db/post.schema";

@QueryHandler(GetPopularPostsQuery)
export class GetPopularPostsHandler implements IQueryHandler<GetPopularPostsQuery>{
    constructor(
        private readonly postDtoRepository: PostDtoRepository,
    ){}

    async execute() {
        try {
            const allPosts = await this.postDtoRepository.findAll();
            const popularPosts = orderbyPopularity(allPosts);
            
            return popularPosts;
        } catch (error) {
            return [];
        }

        function orderbyPopularity(postsNotByUser: PostSchema[]) {

            interface PostSchemaWithPopularity extends PostSchema {
                popularity: number;
            }
    
            const postsWithPopularity: PostSchemaWithPopularity[] = postsNotByUser.map(post => {
                const { shares, comments, likes } = post;
                const shareWeight = 1;
                const commentWeight = 1.2;
                const likeWeight = 0.8;
                const popularity = shares * shareWeight + comments * commentWeight + likes.length * likeWeight;
            
                return { ...post, popularity };
            });
            
            postsWithPopularity.sort((a, b) => b.popularity - a.popularity);
            
            return postsWithPopularity.map(post => {
                const { popularity, ...rest } = post;
                return rest; // Remove the temporary 'popularity' property from the post objects
            });
        }
    }

    
}
