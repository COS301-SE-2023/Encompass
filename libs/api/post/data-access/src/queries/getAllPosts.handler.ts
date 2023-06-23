import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllPostsQuery } from "./getAllPosts.query";
import { PostDtoRepository } from "../db/post-dto.repository";

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsHandler implements IQueryHandler<GetAllPostsQuery> {
  constructor(private readonly postDtoRepository: PostDtoRepository) {}

  async execute() {
    return await this.postDtoRepository.findAll();
  }
}