import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCommentsByUsernameQuery } from "./get-by-username.query";
import { CommentDtoRepository } from "../../db/comment-dto.repository";

@QueryHandler(GetCommentsByUsernameQuery)
export class GetCommentsByUsernameHandler implements IQueryHandler<GetCommentsByUsernameQuery>{
  constructor(private commentDtoRepository: CommentDtoRepository){}

  async execute(query: GetCommentsByUsernameQuery){
    return await this.commentDtoRepository.findByPostId(query.username);
  } 
}