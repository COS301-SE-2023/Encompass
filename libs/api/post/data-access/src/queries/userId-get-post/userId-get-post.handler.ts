import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserIdGetPostQuery } from "./userId-get-post.query";
import { PostDtoRepository } from "../../db/post-dto.repository";
import { PostEntityRepository } from "../../db/post-entity.repository";
import { HttpService } from "@nestjs/axios";
import { PostDto } from "../../post.dto";

@QueryHandler(UserIdGetPostQuery)
export class UserIdGetPostHandler implements IQueryHandler<UserIdGetPostQuery>{
  constructor(
    private readonly postDtoRepository: PostDtoRepository,
    private readonly postEntityRepository: PostEntityRepository,
    private readonly httpService: HttpService,
  ){}

  async execute({ queriedUsername, userId}: UserIdGetPostQuery){
    const url = process.env["BASE_URL"];
    const user = await this.httpService.get(url + '/api/profile/get/' + userId).toPromise();
    const userCommunities = user?.data.communities;

    const posts: PostDto[] = await this.postDtoRepository.getPostsByUserId(queriedUsername);
    const allowedPosts = await this.postEntityRepository.getAllowedPosts(userCommunities, posts);
    return allowedPosts;
  }
}