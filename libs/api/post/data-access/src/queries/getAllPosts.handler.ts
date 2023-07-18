import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllPostsQuery } from "./getAllPosts.query";
import { PostDtoRepository } from "../db/post-dto.repository";
import { PostSchema } from "../db/post.schema";
import { HttpService } from "@nestjs/axios";
import { PostDto } from "../post.dto";
import { ObjectId, Document } from "mongoose";
import mongoose from "mongoose";

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsHandler implements IQueryHandler<GetAllPostsQuery> {
  constructor(
    private readonly postDtoRepository: PostDtoRepository,
    private readonly httpService: HttpService,
  ) {}

  async execute({ username }: GetAllPostsQuery) {
    //complex types
    type postType = (Document<unknown, object, PostSchema> & Omit<PostSchema & Required<{
        _id: mongoose.mongo.BSON.ObjectId;
    }>, never>); 
    //AI
    console.log("Get recommended posts..........");
    const url = process.env["BASE_URL"];
    try {
      const postsNotByUserPromise = this.postDtoRepository.getPostsNotByUser(username);
      const currentUserProfilePromise = this.httpService.get(url + "/api/profile/get-user/" + username).toPromise();
      const [postsNotByUser, currentUserProfile] = await Promise.all([postsNotByUserPromise, currentUserProfilePromise]);
      const userId = currentUserProfile?.data._id;

      const postCount = postsNotByUser.length;
      if (postCount < 1) {
        const recommendedPosts = orderbyPopularity(postsNotByUser);
        return recommendedPosts;
        //console.log(recommendedPosts);
      } else {
        addUserToPosts(postsNotByUser, currentUserProfile?.data);
        //K-means clustering
        const clusters = kmeans(postsNotByUser);
        //get closest cluster to current user profile
        const recommendedCluster = getClusterOfCurrentProfile(clusters, userId);
        //remove current user profile from cluster
        const recommendedPosts = recommendedCluster[0].clusterPosts.filter(post => post.postId !== userId);
        //get recommended Posts from allPosts by _id
        const recommendedPostsFromAllPosts = postsNotByUser.filter(post => recommendedPosts.some(recommendedPost => recommendedPost.postId === post._id.toString()));
        //order recommended posts by popularity
        const orderedRecommendedPosts = orderbyPopularity(recommendedPostsFromAllPosts);
        return orderedRecommendedPosts;
      }

      //append liked posts at the end
    } catch (error) {
      console.log(error);
    }

    

    return await this.postDtoRepository.findAll();
  }
}