import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedPostsQuery } from "./getRecommendedPosts.query";
import { PostDtoRepository } from "../../db/post-dto.repository";
import { HttpService } from "@nestjs/axios";

@QueryHandler(GetRecommendedPostsQuery)
export class GetRecommendedPostsHandler implements IQueryHandler<GetRecommendedPostsQuery> {
  constructor(
    private readonly postDtoRepository: PostDtoRepository,
    private readonly httpService: HttpService,
  ) {}

  async execute( { id }: GetRecommendedPostsQuery ) {
    const url = process.env["BASE_URL"];
    const recommendedUsers = await this.httpService.get(`${url}/profile/get-recommended/${id}`).toPromise();
    const recommendedProfiles = recommendedUsers?.data;
    console.log("recommendedProfiles");
    console.log(recommendedProfiles);
    
    return await this.postDtoRepository.findAll();
  }
}