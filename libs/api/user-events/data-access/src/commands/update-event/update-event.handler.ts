import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { UpdateEventCommand } from "./update-event.command";
import { UserEventsEntityRepository } from "../../db/user-events-entity.repository";
import { HttpService } from "@nestjs/axios";

@CommandHandler(UpdateEventCommand)
export class UpdateEventHandler implements ICommandHandler<UpdateEventCommand>{
  constructor(
    private userEventsEntityRepository: UserEventsEntityRepository,
    private eventPublisher: EventPublisher,
    private httpService: HttpService
  ){}

  async execute({userId, updateEventRequest}: UpdateEventCommand) {
    const url = process.env['BASE_URL'];

    let count  = 0;
    const userEvent = this.eventPublisher.mergeObjectContext(
      await this.userEventsEntityRepository.findOneById(userId)
    )

    const eventIndex = userEvent.events.findIndex(event => event.eventId === updateEventRequest.eventId);
    const amountCorrect = updateEventRequest.numCorrect - userEvent.events[eventIndex].numCorrect;

    userEvent.updateEvent(updateEventRequest);
    this.userEventsEntityRepository.findOneAndReplaceById(userEvent._id, userEvent);
    userEvent.commit();

    const amount = amountCorrect * 20

    if(amount > 0){
      try{
        this.httpService.patch(`${url}/api/profile/add-coins-by-userId/${userId}/${amount}`).toPromise()
      }

      catch(error){
        console.log(error)
      }
    }
     

    userEvent.events.forEach(event => {
      if(event.quizComplete){
        count++;
      }
    })

    if(count >= 10){
      try{
        this.httpService.patch(`${url}/api/profile/add-award-by-userId/${userId}/complete10`).toPromise()
      }

      catch(error){
        console.log(error)
      }
    }

    if(count >= 20){
      try{
        this.httpService.patch(`${url}/api/profile/add-award-by-userId/${userId}/complete20`).toPromise()
      }

      catch(error){
        console.log(error)
      }
    }

    return userEvent;
  }
}