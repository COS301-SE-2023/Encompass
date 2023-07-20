import { Get } from "@nestjs/common";
import { GetLatestPostsQuery } from "./getLatestPosts.query";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PostDtoRepository } from "../../db/post-dto.repository";
import { PostSchema } from "../../db/post.schema";

@QueryHandler(GetLatestPostsQuery)
export class GetLatestPostHandler implements IQueryHandler<GetLatestPostsQuery> {
    constructor(
        private readonly postDtoRepository: PostDtoRepository,
    ){}

    async execute() {
        try {
            const allPosts = await this.postDtoRepository.findAll();
            const latestPosts = orderbyLatest(allPosts);
            
            return latestPosts;
        } catch (error) {
            return [];
        }

        async function orderbyLatest(allPosts: PostSchema[]) {
            
            //order by dateAdded which is the string YYY-MM-DD, HH:MM:SS
            //i.e dateAdded: "2023-06-30, 8:16:55 PM" may be a property of a post
            const latestPosts = allPosts.sort((a, b) => {
                return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
            });
            return latestPosts;
        }
    }
}