import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetPostsByKeywordQuery } from "./get-posts-by-keyword.query";
import { PostEntityRepository } from "../../db/post-entity.repository";
import { HttpService } from "@nestjs/axios";
import { PostDtoRepository } from "../../db/post-dto.repository";

@QueryHandler(GetPostsByKeywordQuery)
export class GetPostsByKeywordHandler implements IQueryHandler<GetPostsByKeywordQuery> {
    constructor(
        private readonly postEntityRepository: PostEntityRepository,
        private readonly httpService: HttpService    
    ) {}

    async execute({ keyword, userId }: GetPostsByKeywordQuery) {
        const url = process.env["BASE_URL"];
        let userCommunities: string[] = [];
        let allowedPosts;
        try {
            const posts = await this.postEntityRepository.findPostsByKeyword(keyword);
            const user = await this.httpService.get(url + '/api/profile/get/' + userId).toPromise();
            //get user communities
            userCommunities = user?.data.communities;
            allowedPosts = await this.postEntityRepository.getAllowedPosts(userCommunities, posts);
        } catch (error) {
            console.log(error);
            return [];
        }
        
        return allowedPosts;
    }
}