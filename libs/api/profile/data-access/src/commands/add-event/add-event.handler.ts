import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { AddEventCommand } from "./add-event.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";
import { HttpService } from "@nestjs/axios";

@CommandHandler(AddEventCommand)
export class AddEventHandler implements ICommandHandler<AddEventCommand>{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly profileEntityRepository: ProfileEntityRepository,
    private readonly httpService: HttpService
  ){}

  async execute({ username, eventId }: AddEventCommand){
    const url = process.env['BASE_URL'];

    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(username)
    );

    profile.addEvent(eventId);
    profile.addCoins(5)
    this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    try{
      this.httpService.patch(`${url}/api/user-events/add-event/${profile._id}/${eventId}`).toPromise()
    }

    catch(error){
      console.log(error)
    }

    return profile;
  }
}