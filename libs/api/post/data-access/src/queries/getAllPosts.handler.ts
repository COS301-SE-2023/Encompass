import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllPostsQuery } from "./getAllPosts.query";
import { PostDtoRepository } from "../db/post-dto.repository";
import { PostSchema } from "../db/post.schema";
import { HttpService } from "@nestjs/axios";

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsHandler implements IQueryHandler<GetAllPostsQuery> {
  constructor(
    private readonly postDtoRepository: PostDtoRepository,
    private readonly httpService: HttpService,
  ) {}

  async execute({ username }: GetAllPostsQuery) {
    //AI
    console.log("Get recommended posts..........");
    const url = process.env["BASE_URL"];
    try {
      const postsNotByUser = await this.postDtoRepository.getPostsNotByUser(username);
      //const currentUserProfilePromise = this.httpService.get(url + "api/profile/get/" + userId).toPromise();
      const postCount = postsNotByUser.length;
      if (postCount < 10) {
        const recommendedPosts = orderbyPopularity(postsNotByUser);
        return recommendedPosts;
        //console.log(recommendedPosts);
      } else {
        console.log("wtf");
        const K = defineK(postCount);

      }

      //append liked posts at the end
    } catch (error) {
      console.log(error);
    }

    function defineK(postCount: number) {
      const k = Math.sqrt(postCount);
      return Math.floor(k);
    }

    function orderbyPopularity(postsNotByUser: PostSchema[]) {

      interface PostSchemaWithPopularity extends PostSchema {
        popularity: number;
      }



      const postsWithPopularity: PostSchemaWithPopularity[] = postsNotByUser.map(post => {
        const { shares, comments, likes } = post;
        const shareWeight = 1;
        const commentWeight = 1.2;
        const likeWeight = 0.8;
        const popularity = shares * shareWeight + comments * commentWeight + likes.length * likeWeight;
    
        return { ...post, popularity };
      });
    
      postsWithPopularity.sort((a, b) => b.popularity - a.popularity);
    
      return postsWithPopularity.map(post => {
        const { popularity, ...rest } = post;
        return rest; // Remove the temporary 'popularity' property from the post objects
      });
    }

    return await this.postDtoRepository.findAll();
  }
}