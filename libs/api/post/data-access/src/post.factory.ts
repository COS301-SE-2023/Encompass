import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { Post } from "./post";
import { PostEntityRepository } from "./db/post-entity.repository";
import { PostCreatedEvent } from "./events";
import { ObjectId } from "mongodb";

@Injectable()
export class PostFactory implements EntityFactory<Post>{
  constructor(
    private readonly postEntityRepository: PostEntityRepository,
  ){}

  async create(
    communityId: string,
    title: string,
    text: string,
    username: string,
    imageUrl: string | null,
    categories: string[] | null,
    likes: string[] | null,
  ) : Promise<Post>{
    const post = new Post(
      new ObjectId().toHexString(),
      communityId,
      title,
      text,
      username,
      imageUrl,
      categories,
      likes,
      new Date(),
    );
    await this.postEntityRepository.create(post);
    post.apply(new PostCreatedEvent(post.getId()))
    return post;
  }
}