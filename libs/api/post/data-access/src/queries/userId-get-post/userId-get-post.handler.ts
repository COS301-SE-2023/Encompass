import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserIdGetPostQuery } from "./userId-get-post.query";
import { PostDtoRepository } from "../../db/post-dto.repository";

@QueryHandler(UserIdGetPostQuery)
export class UserIdGetPostHandler implements IQueryHandler<UserIdGetPostQuery>{
  constructor(private readonly postDtoRepository: PostDtoRepository){}

  async execute(query: UserIdGetPostQuery){
    return await this.postDtoRepository.getPostsByUserId(query.userId);
  }
}