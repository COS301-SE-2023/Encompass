import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCommentsByUsernameQuery } from "./get-by-username.query";
import { CommentEntityRepository } from "../../db/comment-entity.repository";

@QueryHandler(GetCommentsByUsernameQuery)
export class GetCommentsByUsernameHandler implements IQueryHandler<GetCommentsByUsernameQuery>{
  constructor(private commentEntityRepository: CommentEntityRepository){}

  async execute(query: GetCommentsByUsernameQuery){
    const mainComments = await this.commentEntityRepository.findCommentsByUsername(query.username);
    // const subComments = await this.commentEntityRepository.findSubCommentsByUsername(query.username);

    // console.log(subComments);

    const comments = mainComments;

    // for(let i = 0; i < subComments.length; i++){
    //   comments.findIndex(e => e === subComments[i]) === -1 ? comments.push(subComments[i]) : console.log(`User already exists}`);
    // }

    return comments;
  } 
}