import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { CreateProfileCommand } from "./create-profile.command";
import { ProfileFactory } from "../../profile.factory";

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler
  implements ICommandHandler<CreateProfileCommand>{
    constructor(
      private readonly profileFactory: ProfileFactory,
      private readonly eventPublisher: EventPublisher,
    ){}

    async execute({ createProfileRequest }: CreateProfileCommand){
      const { 
        _id, 
        username, 
        name, 
        lastName,
        categories,
        awards, 
        events, 
        followers, 
        following, 
        posts, 
        reviews 
      } = createProfileRequest;

      const profile = this.eventPublisher.mergeObjectContext(
        await this.profileFactory.create(
          _id, 
          username, 
          name, 
          lastName,
          categories,
          awards,
          events, 
          followers, 
          following, 
          posts, 
          reviews 
        )
      );

      profile.commit();

      return profile;
    }
  }