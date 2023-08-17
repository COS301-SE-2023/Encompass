import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { RemoveCoinsCommand } from "./remove-coins.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";
import { HttpService } from "@nestjs/axios";

@CommandHandler(RemoveCoinsCommand)
export class RemoveCoinsHandler implements ICommandHandler<RemoveCoinsCommand>{
  constructor(
    private readonly profileEntityRepository: ProfileEntityRepository,
    private readonly eventPublisher: EventPublisher,
    private httpService: HttpService
  ){}

  async execute({ username, removeCoinsAmount }: RemoveCoinsCommand){
    const url = process.env["BASE_URL"];

    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(username),
    );

    profile.removeCoins(removeCoinsAmount);
    await this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);

    profile.communities?.forEach(community => {
      try{
        this.httpService.patch(url + '/api/community/remove-coins/' + community + '/' + removeCoinsAmount).toPromise();
      }

      catch(error){
        console.log(error);
      }
    })
    profile.commit();

    return profile;
  }
}