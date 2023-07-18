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

    function calculateNewCentroids(clusters: { clusterCentroid: number[], clusterPosts: { post: number[], postId: string }[] }[]) {
      for(let j = 0; j < clusters.length; j++){
          if(clusters[j].clusterPosts.length == 0){
              continue;
          }
          for(let l = 0; l < clusters[0].clusterCentroid.length; l++){
              let sum = 0;
              for(let k = 0; k < clusters[j].clusterPosts.length; k++){
                  sum += clusters[j].clusterPosts[k].post[l];
              }
              clusters[j].clusterCentroid[l] = sum / clusters[j].clusterPosts.length; 
          }   
      }
    }

    function moveToClosestCentroid(postArrays: { post: number[], postId: string }[], clusters: { clusterCentroid: number[], clusterPosts: { post: number[], postId: string }[] }[], k: number) {
      //if all clusterPosts in clusters are empty, just add post to closest clusterCentroid else move post to new closest clusterCentroid
      const initialClustersEmpty = clusters.every(cluster => cluster.clusterPosts.length == 0);
      for(let i = 0; i < postArrays.length; i++){
          const distances = [];
          for(let j = 0; j < k; j++){
              distances.push(getDistance(clusters[j].clusterCentroid, postArrays[i]));
          }
          //get the index of the smallest distance and insert profile into that cluster
          let smallestDistance = distances[0];
          let smallestDistanceIndex = 0;
          for(let j = 0; j < distances.length; j++){
              if(distances[j] < smallestDistance){
                  smallestDistance = distances[j];
                  smallestDistanceIndex = j;
              }
          }

          //test this!!!
          if(initialClustersEmpty){
              clusters[smallestDistanceIndex].clusterPosts.push(postArrays[i]);
          } else {
              //find the closest clusterCentroid to the profile
              //if the profile is already in closest clusterCentroid then do nothing, else move the profile to the new closest clusterCentroid
              if(clusters[smallestDistanceIndex].clusterPosts.includes(postArrays[i])){
                  continue;
              } else {
                  for(let j = 0; j < k; j++){
                      if(clusters[j].clusterPosts.includes(postArrays[i])) {
                          clusters[j].clusterPosts.splice(clusters[j].clusterPosts.indexOf(postArrays[i]), 1);
                          clusters[smallestDistanceIndex].clusterPosts.push(postArrays[i]);
                          break;
                      }
                  }
              }
          }
      }
    }

    function getDistance(clusterCentroid: number[], post: { post: number[], postId: string }) {
      let distance = 0;
      for(let i = 0; i < clusterCentroid.length; i++){
          distance += Math.pow(clusterCentroid[i] - post.post[i], 2);
      }
      return Math.sqrt(distance);
    }

    function setupPostArrays(items: postType[]) {
      const posts: { post: number[], postId: string }[] = [];
      const postIds: string[] = [];
      const categories: string[] = [];
      const communities: string[] = [];
      const likers: string[] = [];

      //get all categories, communities, and likers
      items.forEach(item => {
        postIds.push(item._id.toString());
        item.categories.forEach(category => {
            if(!categories.includes(category)){
                categories.push(category);
            }
        });
        if(!communities.includes(item.community) && item.community != ''){
            communities.push(item.community);
        }
        item.likes.forEach(liker => {
            if(!likers.includes(liker)){
                likers.push(liker);
            }
        });
      });

      /*console.log("------------");
      console.log("categories:");
      console.log(categories);
      console.log("communities:");
      console.log(communities);
      console.log("likers:");
      console.log(likers);
      console.log("------------");*/

      //push 0 or 1 to each post array if it has the category, community, or liker and then add the postId
      items.forEach(item => {
        const post: number[] = [];
        categories.forEach(category => {
            if(item.categories.includes(category)){
                post.push(1);
            } else {
                post.push(0);
            }
        });
        communities.forEach(community => {
            if(item.community === community){
                post.push(1);
            } else {
                post.push(0);
            }
        });
        likers.forEach(liker => {
            if(item.likes.includes(liker)){
                post.push(1);
            } else {
                post.push(0);
            }
        });
        posts.push({ post: post, postId: item._id.toString() });
      });
      
      /*console.log("*******");
      console.log("posts:");
      console.log(posts);*/

      return posts;
    }

    function addUserToPosts(postsNotByUser: PostSchema[], currentUserProfile: any) {
      //add currentUserProfile as postNotByUser
      const currentUserProfilePost: PostSchema = {
        _id: currentUserProfile._id,
        community: "",
        title: "",
        text: "",
        username: currentUserProfile.username,
        imageUrl: "",
        communityImageUrl: null,
        categories: [],
        likes: [],
        dateAdded: "",
        spoiler: false,
        ageRestricted: false,
        shares: 0,
        comments: 0,
        reported: false
      };
      postsNotByUser.push(currentUserProfilePost);
    }

    function defineK(postCount: number) {
      const k = Math.sqrt(postCount);
      return Math.floor(k);
    }

    

    return await this.postDtoRepository.findAll();
  }
}