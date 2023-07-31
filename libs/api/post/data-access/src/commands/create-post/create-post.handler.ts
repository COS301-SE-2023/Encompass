import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { CreatePostCommand } from "./create-post.command";
import { PostFactory } from "../../post.factory";
import { HttpService } from "@nestjs/axios";
import { CommunityDto } from "@encompass/api/community/data-access";

@CommandHandler(CreatePostCommand)
export class CreatePostHandler 
  implements ICommandHandler<CreatePostCommand>{
    constructor(
      private readonly postFactory: PostFactory,
      private readonly eventPublisher: EventPublisher,
      private readonly httpService: HttpService
    ){}

    async execute({ createPostRequest }: CreatePostCommand){
      const url = process.env["BASE_URL"]
      let isPrivate = false;

      const {
        community,
        title,
        text,
        username,
        imageUrl,
        communityImageUrl,
        categories,
        likes,
        spoiler,
        ageRestricted
      } = createPostRequest;

      const getCommunityPromise = this.httpService.get<CommunityDto>(url + '/api/community/get-community/' + community).toPromise();
      const getCommunity = await Promise.resolve(getCommunityPromise);

      if(getCommunity !== null && getCommunity !== undefined){
        if(getCommunity.data.type === "Private"){
          isPrivate = true;
        }
      }

      const post = this.eventPublisher.mergeObjectContext(
        await this.postFactory.create(
          community,
          title,
          text,
          username,
          imageUrl,
          communityImageUrl,
          categories,
          likes,
          spoiler,
          ageRestricted,
          isPrivate
        )
      );

      post.commit();

      return post;
    }
  }