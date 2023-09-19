import { Get } from "@nestjs/common";
import { GetLatestPostsQuery } from "./getLatestPosts.query";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PostDtoRepository } from "../../db/post-dto.repository";
import { PostSchema } from "../../db/post.schema";
import { PostEntityRepository } from "../../db/post-entity.repository";
import { HttpService } from "@nestjs/axios";

@QueryHandler(GetLatestPostsQuery)
export class GetLatestPostHandler implements IQueryHandler<GetLatestPostsQuery> {
    constructor(
        private readonly postEntityRepository: PostEntityRepository,
        private readonly httpService: HttpService,
    ){}

    async execute( {username}: GetLatestPostsQuery ) {
        const url = process.env["BASE_URL"];
        try {
            let allPosts: any[] = [];
            const currentUser = await this.httpService.get(`${url}/api/profile/get-user/${username}`).toPromise();
            const currentUserData = currentUser?.data;
            const currentUserCommunities = currentUserData?.communities;

            for (const communityName of currentUserCommunities) {
                const communityPosts = await this.postEntityRepository.findByCommunity(communityName);
                allPosts = [...allPosts, ...communityPosts];
            }
            const latestPosts = orderbyLatest(allPosts);
            return latestPosts;
        } catch (error) {
            return [];
        }

        async function orderbyLatest(allPosts: PostSchema[]) {
            //reorder posts by date
            const latestPosts = allPosts.sort((a, b) => {
                return b.dateAdded.getTime() - a.dateAdded.getTime();
            });
            return latestPosts;
        }
    }
}