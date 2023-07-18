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

    function getClusterOfCurrentProfile( clusters: { clusterCentroid: number[], clusterPosts: { post: number[], postId: string }[] }[], userId: string ) {
      const userCluster = clusters.filter(cluster => cluster.clusterPosts.some(post => post.postId === userId));
      return userCluster;
    }

    function kmeans(items: postType[]) {
      const k = defineK(items.length);
      const postArrays = setupPostArrays(items);
      const tempPostArrays = Object.values(postArrays);
      const clusters: { clusterCentroid: number[], clusterPosts: { post: number[], postId: string }[] }[] = [];
      //choose k random tempPostArrays to be cluster centroids
      for (let i = 0; i < k; i++) {
          const randomIndex = Math.floor(Math.random() * tempPostArrays.length);
          clusters.push({ clusterCentroid: Object.values(tempPostArrays[randomIndex].post) , clusterPosts: [] });
          tempPostArrays.splice(randomIndex, 1);
      }

      let oldCentroids = clusters.map(cluster => Object.values( cluster.clusterCentroid ));
      let newCentroids = clusters.map(cluster => Object.values( cluster.clusterCentroid ));
      //while centroids are changing
      do{
          oldCentroids = newCentroids;
          //assign each post to the closest cluster
          moveToClosestCentroid(postArrays, clusters, k);
          //recalculate the cluster centroids
          calculateNewCentroids(clusters);
          newCentroids = clusters.map(cluster => Object.values( cluster.clusterCentroid ));
          //console.log("--------recalculate centroids--------");
          //print out the number of posts in each cluster
          /*for(let i = 0; i < clusters.length; i++){
              console.log("cluster " + i + ": " + clusters[i].clusterPosts.length);
          }*/
      } while ( !arraysAreEqual(oldCentroids, newCentroids) );
      
      return clusters;
    }

    function arraysAreEqual(array1: number[][], array2: number[][]) {
      if(array1.length != array2.length){
          return false;
      }
      for(let i = 0; i < array1.length; i++){
          if(array1[i].length != array2[i].length){
              return false;
          }
          for(let j = 0; j < array1[i].length; j++){
              if(array1[i][j] != array2[i][j]){
                  return false;
              }
          }
      }
      return true;
    }

    

    return await this.postDtoRepository.findAll();
  }
}