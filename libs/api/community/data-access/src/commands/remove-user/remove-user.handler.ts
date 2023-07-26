import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { RemoveUserCommand } from "./remove-user.command";
import { CommunityEntityRepository } from "../../db/community-entity.repository";
import { HttpService } from "@nestjs/axios";

@CommandHandler(RemoveUserCommand)
export class RemoveUserHandler implements ICommandHandler<RemoveUserCommand>{
  constructor(private eventPublisher: EventPublisher, private communityEntityRepository: CommunityEntityRepository, private readonly httpService: HttpService){}
    async execute({username, communityName}: RemoveUserCommand){
      const url = process.env["BASE_URL"]

      const community = this.eventPublisher.mergeObjectContext(
        await this.communityEntityRepository.findOneByName(communityName),
      );
      community.removeUser(username);
      this.communityEntityRepository.findOneAndReplaceById(community._id, community);
      community.commit();

      try{
        this.httpService.patch(url + '/api/profile/remove-community/' + username + '/' + communityName).toPromise();
      }
  
      catch(error){
        console.log(error);
      }

      return community;
    }
}