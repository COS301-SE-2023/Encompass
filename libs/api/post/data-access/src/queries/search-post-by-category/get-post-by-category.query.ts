import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PostEntityRepository } from "../../db/post-entity.repository";
import { GetPostsByCategoryQuery } from "./get-post-by-category.handler";

@QueryHandler(GetPostByCategoryHandler)
export class GetPostByCategoryHandler implements IQueryHandler<GetPostsByCategoryQuery> {
    constructor(private readonly postEntityRepository: PostEntityRepository) {}

    async execute({ category }: GetPostsByCategoryQuery) {
        return this.postEntityRepository.findPostsByCategory(category);
    }
}