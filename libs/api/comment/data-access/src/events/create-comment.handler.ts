import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CommentCreatedEvent } from "./create-comment.event";

@EventsHandler(CommentCreatedEvent)
export class CommentCreateHandler implements IEventHandler<CommentCreatedEvent>{
  async handle({ commentId }: CommentCreatedEvent): Promise<void>{
    console.log("Comment created event handled")
  }
}