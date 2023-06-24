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
    community: string,
    title: string,
    text: string,
    username: string,
    imageUrl: string | null,
    categories: string[] | null,
    likes: string[] | null,
    spoiler: boolean,
    ageRestricted: boolean
  ) : Promise<Post>{
    const post = new Post(
      new ObjectId().toHexString(),
      community,
      title,
      text,
      username,
      imageUrl,
      categories,
      likes,
      this.createDateAsString(),
      spoiler,
      ageRestricted,
      0,
      0,
    );
    await this.postEntityRepository.create(post);
    post.apply(new PostCreatedEvent(post.getId()))
    return post;
  }

  createDateAsString(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    return dateString;
  }
  
}