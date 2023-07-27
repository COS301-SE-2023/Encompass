import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetPostsByKeywordQuery } from "./get-posts-by-keyword.query";
import { PostEntityRepository } from "libs/api/post/data-access/src/db/post-entity.repository";

@QueryHandler(GetPostsByKeywordQuery)
export class GetPostsByKeywordHandler implements IQueryHandler<GetPostsByKeywordQuery> {
    constructor(private readonly postEntityRepository: PostEntityRepository) {}

    async execute({ keyword }: GetPostsByKeywordQuery) {
        return this.postEntityRepository.findPostsByKeyword(keyword);
    }
}