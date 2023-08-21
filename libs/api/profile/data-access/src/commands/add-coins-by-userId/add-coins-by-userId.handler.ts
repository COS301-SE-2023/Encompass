import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { AddCoinsByUserIdCommand } from "./add-coins-by-userId.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";
import { HttpService } from "@nestjs/axios";

@CommandHandler(AddCoinsByUserIdCommand)
export class AddCoinsByUserIdHandler implements ICommandHandler<AddCoinsByUserIdCommand>{
  constructor(
    private readonly profileEntityRepository: ProfileEntityRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly httpService: HttpService
  ){}

  async execute({userId, coins}: AddCoinsByUserIdCommand){
    const url = process.env["BASE_URL"];
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneById(userId)
    );

    profile.addCoins(coins);
    this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);

    profile.communities?.forEach(community => {
      try{
        this.httpService.patch(url + '/api/community/add-coins/' + community + '/' + coins).toPromise();
      }

      catch(error){
        console.log(error);
      }
    })

    profile.commit();

    return profile;
  }
}