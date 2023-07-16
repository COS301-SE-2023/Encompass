import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { CreateProfileCommand } from "./create-profile.command";
import { ProfileFactory } from "../../profile.factory";
import { HttpService } from "@nestjs/axios";

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler
  implements ICommandHandler<CreateProfileCommand>{
    constructor(
      private readonly profileFactory: ProfileFactory,
      private readonly eventPublisher: EventPublisher,
      private readonly httpService: HttpService
    ){}

    async execute({ createProfileRequest }: CreateProfileCommand){

      const url = process.env["BASE_URL"];

      const { 
        _id, 
        username, 
        name, 
        lastName,
        categories,
        communities,
        awards, 
        events, 
        followers, 
        following, 
        posts, 
        reviews,
        profileImage,
        profileBanner,
        bio,
      } = createProfileRequest;

      const profile = this.eventPublisher.mergeObjectContext(
        await this.profileFactory.create(
          _id, 
          username, 
          name, 
          lastName,
          categories,
          communities,
          awards,
          events, 
          followers, 
          following, 
          posts, 
          reviews,
          profileImage,
          profileBanner,
          bio,
        )
      );

      profile.commit();
      
      try{
        this.httpService.post(url + '/api/chat-list/create', {username: profile.username}).toPromise();
        this.httpService.post(url + '/api/settings/create/' + _id, {} ).toPromise();
      }

      catch(error){
        console.log(error);
      }

      return profile;
    }
  }