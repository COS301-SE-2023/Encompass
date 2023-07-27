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
    console.log("url");
    const allPostsPromise = this.postDtoRepository.findAll();
    const recommendedUsersPromise = this.httpService.get(`${url}/api/profile/get-recommended/${id}`).toPromise();
    const currentUserPromise = this.httpService.get(`${url}/api/profile/get/${id}`).toPromise();
    const [allPosts, recommendedUsers, currentUser] = await Promise.all([allPostsPromise, recommendedUsersPromise, currentUserPromise]);
    const recommendedProfiles = recommendedUsers?.data;
    const currentUserData = currentUser?.data;
    console.log("recommendedProfiles");
    console.log(recommendedProfiles.length);

    const profileNames = recommendedProfiles.map((profile: { username: string; }) => profile.username);
    //recommendedPosts are all posts with the username or likes by the username, NB: likes is an array of usernames
    const recommendedPosts = allPosts.filter((post: { username: string; likes: string[]; }) => profileNames.includes(post.username) || post.likes.some((like: string) => profileNames.includes(like)));
    console.log("recommendedPosts");
    console.log(recommendedPosts);
    
    const currentUserName = currentUserData.username;
    console.log("currentUserName");
    console.log(currentUserName);
    const postsToRemove = recommendedPosts.filter((post: { username: string; likes: string[]; }) => post.username === currentUserName || post.likes.includes(currentUserName));
    console.log("recommended posts:");
    console.log(recommendedPosts);
    console.log("posts to remove:");
    console.log(postsToRemove);
    //remove all posts by the current user or liked by the current user from recommendedPosts and append them at the end
    postsToRemove.forEach((post: { username: string; likes: string[]; }) => {
        const index = recommendedPosts.indexOf(post);
        recommendedPosts.splice(index, 1);
        recommendedPosts.push(post);
    });

    //add the rest of the posts to the bottom

    return await this.postDtoRepository.findAll();
  }
}