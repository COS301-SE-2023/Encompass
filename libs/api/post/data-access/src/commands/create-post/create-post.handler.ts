import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { CreatePostCommand } from "./create-post.command";
import { PostFactory } from "../../post.factory";

@CommandHandler(CreatePostCommand)
export class CreatePostHandler 
  implements ICommandHandler<CreatePostCommand>{
    constructor(
      private readonly postFactory: PostFactory,
      private readonly eventPublisher: EventPublisher,
    ){}

    async execute({ createPostRequest }: CreatePostCommand){
      const {
        communityId,
        title,
        text,
        username,
        imageUrl,
        categories,
        likes,
      } = createPostRequest;

      const post = this.eventPublisher.mergeObjectContext(
        await this.postFactory.create(
          communityId,
          title,
          text,
          username,
          imageUrl,
          categories,
          likes
        )
      );

      post.commit();

      return post;
    }
  }