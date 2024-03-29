import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedPostsQuery } from "./getRecommendedPosts.query";
import { PostDtoRepository } from "../../db/post-dto.repository";
import { PostSchema } from "../../db/post.schema";
import { PostDto } from "../../post.dto";
import { ObjectId, Document } from "mongoose";
import { HttpService } from "@nestjs/axios";
import mongoose from "mongoose";

@QueryHandler(GetRecommendedPostsQuery)
export class GetRecommendedPostsHandler implements IQueryHandler<GetRecommendedPostsQuery> {
  constructor(
    private readonly postDtoRepository: PostDtoRepository,
    private readonly httpService: HttpService,
  ) {}

  async execute( { id }: GetRecommendedPostsQuery ) {
    //complex types
    type postType = (Document<unknown, object, PostSchema> & Omit<PostSchema & Required<{
      _id: mongoose.mongo.BSON.ObjectId;
    }>, never>); 

    //AI
    const url = process.env["BASE_URL"];

    try {
      const recommendedUsersPromise = this.httpService.get(`${url}/api/profile/get-recommended/${id}`).toPromise();
      const currentUserPromise = this.httpService.get(`${url}/api/profile/get/${id}`).toPromise();
      const [recommendedUsers, currentUser] = await Promise.all([ recommendedUsersPromise, currentUserPromise]);
      const currentUserCommunities = currentUser?.data?.communities;
      const allPostst = await this.postDtoRepository.getAllowedPosts(currentUserCommunities);

      const recommendedProfiles = recommendedUsers?.data;
      const currentUserData = currentUser?.data;

      //remove posts disliked by user
      const allPostsFiltered = removePostsDislikedByUser(currentUserData.username, allPostst);

      //remove posts in user communities
      const allPosts = removePostsInUserCommunities(currentUserData.communities, allPostsFiltered);

      const profileNames = recommendedProfiles.map((profile: { username: string; }) => profile.username);
      
      //recommendedPosts are all posts with the username or likes by the username, NB: likes is an array of usernames
      const recommendedPosts = allPosts.filter((post: { username: string; likes: string[]; }) => profileNames.includes(post.username) || post.likes.some((like: string) => profileNames.includes(like)));

      const currentUserName = currentUserData.username;
      const postsToRemove = recommendedPosts.filter((post: { username: string; likes: string[]; }) => post.username === currentUserName || post.likes.includes(currentUserName));
      
      //remove all posts by the current user or liked by the current user from recommendedPosts and append them at the end
      postsToRemove.forEach((post: postType) => {
          const index = recommendedPosts.indexOf(post);
          recommendedPosts.splice(index, 1);
          recommendedPosts.push(post);
      });

      //add the rest of the posts to the bottom
      const postsToAdd = allPosts.filter((post: postType) => !recommendedPosts.includes(post));
      recommendedPosts.push(...postsToAdd);
      return recommendedPosts;

    } catch (error) {
      console.log(error);
      return [];
    }

    function removePostsDislikedByUser(username: string, posts: any[]) {
      const filteredPosts = posts.filter((post: { dislikes: string[]; }) => {
        const dislikers = post.dislikes as string[];
        const isDisliker = dislikers.includes(username);
        return !isDisliker;
      })
      return filteredPosts;
    }
  
    function removePostsInUserCommunities(communities: string[], posts: any[]) {
      const filteredPosts = posts.filter((post: { community: string; }) => {
        const isFromSameCommunity = communities.includes(post.community);
        return !isFromSameCommunity;
      })
      return filteredPosts;
    }
  }
}