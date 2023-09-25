import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PostSchema } from "./post.schema";
import { Model } from "mongoose";
import { PostDto } from "../post.dto";

@Injectable()
export class PostDtoRepository{
  constructor(
    @InjectModel(PostSchema.name)
    private readonly postModel: Model<PostSchema>,
  ){}

  async findAll(){
    return await this.postModel.find();
  }

  async getAllowedPosts(communities: string[]){
    //get all posts except private posts not from same community as user
    const allPosts = await this.findAll();
    const filteredPosts = allPosts.filter(post => {
      const isPrivate = post.isPrivate;
      const isFromSameCommunity = communities.includes(post.community);
      return !isPrivate || isFromSameCommunity;
    });
    return filteredPosts;
  }

  async findById(id: string){
    return await this.postModel.findOne({ _id: id });
  }

  async getPostsByUserId(userId: string){
    return await this.postModel.find({ username: userId }) as PostDto[];
  }

  async getPostsMadeOrLikedByUser(username: string){
    const allPosts = await this.findAll();
    const filteredPosts = allPosts.filter(post => {
      const creator = post.username === username;
      const likers = post.likes as string[];
      const isliker = likers.includes(username);
      return isliker || creator;
    });
    return filteredPosts;
  }


  async getPostsNotByUser(username: string) {
    const allPosts = await this.findAll();
    const filteredPosts = allPosts.filter(post => {
      const creator = post.username === username;
      const likers = post.likes as string[];
      const isliker = likers.includes(username);
      return !isliker && !creator;
    });
    return filteredPosts;
  }
}