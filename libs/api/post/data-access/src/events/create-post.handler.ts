import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PostCreatedEvent } from "./create-post.event";

@EventsHandler(PostCreatedEvent)
export class PostCreatedHandler implements IEventHandler<PostCreatedEvent>{
  async handle({ postId }: PostCreatedEvent): Promise<void>{
    console.log("Post created event handled")
  }
}