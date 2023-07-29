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
    communityImageUrl: string | null,
    categories: string[],
    likes: string[],
    spoiler: boolean,
    ageRestricted: boolean,
    isPrivate: boolean
  ) : Promise<Post>{
    const post = new Post(
      new ObjectId().toHexString(),
      community,
      title,
      text,
      username,
      imageUrl,
      communityImageUrl,
      categories,
      likes,
      this.createDateTimeAsString(),
      spoiler,
      ageRestricted,
      0,
      0,
      false,
      isPrivate
    );
    await this.postEntityRepository.create(post);
    post.apply(new PostCreatedEvent(post.getId()))
    return post;
  }

  createDateTimeAsString(): string {
    const currentDate = new Date();
    const dateStringWithTime = currentDate.toLocaleString();
    return dateStringWithTime;
  }
  
}