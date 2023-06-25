import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PostIdGetCommentsQuery } from "./postId-get-comments.query";
import { CommentDtoRepository } from "../../db/comment-dto.repository";

@QueryHandler(PostIdGetCommentsQuery)
export class PostIdGetCommentsHandler implements IQueryHandler<PostIdGetCommentsQuery>{
  constructor(private readonly commentDtoRepository: CommentDtoRepository){}

  async execute(query: PostIdGetCommentsQuery){
    return await this.commentDtoRepository.findByPostId(query.postId);
  }
}