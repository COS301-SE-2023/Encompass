import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostSchema } from "./post.schema";
import { Post } from "../post";
import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { PostSchemaFactory } from "./post-schema.factory";
import { PostDto } from "../post.dto";

@Injectable()
export class PostEntityRepository extends BaseEntityRepository<
  PostSchema,
  Post
> {
  constructor(
    @InjectModel(PostSchema.name)
    postModel: Model<PostSchema>,
    postSchemaFactory: PostSchemaFactory,
  ) {
    super(postModel, postSchemaFactory);
  }

  async findPostsByKeyword(keyword: string): Promise<PostDto[]> {
    const lowerCaseKeyword = keyword.toLowerCase();
    const allPosts = await this.findAll();
    const filteredPosts = allPosts.filter(post => {
      if (!post) {
        return false; // Skip if post or members is undefined
      }

      const title = post.title? post.title.toLowerCase() : '';
      const content = post.text? post.text.toLowerCase() : '';
      const categories = post.categories? (post.categories as string[]).map(category => category.toLowerCase()) : [];

      const isCategoryMatch = categories.includes(lowerCaseKeyword);
      const isTitleMatch = title.includes(lowerCaseKeyword);
      const isContentMatch = content.includes(lowerCaseKeyword);
      return isTitleMatch || isContentMatch || isCategoryMatch;
    });
    return filteredPosts;
  }

  async findPostsByCategory(category: string): Promise<PostDto[]> {
    const allPosts = await this.findAll();
    const filteredPosts = allPosts.filter(post => {
      const categories = post.categories as string[];
      const lowerCaseCategories = categories.map(category =>
        category.toLowerCase(),
      );
      const isCategoryMatch = lowerCaseCategories.includes(category.toLowerCase());
      return isCategoryMatch;
    });
    return filteredPosts;
  }

}