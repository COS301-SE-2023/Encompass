import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { CreateEventCommand } from "./create-event.command";
import { EventFactory } from "../../event.factory";
import { HttpService } from "@nestjs/axios";

@CommandHandler(CreateEventCommand)
export class CreateEventHandler
  implements ICommandHandler<CreateEventCommand>{
    constructor(
      private readonly eventFactory: EventFactory,
      private readonly eventPublisher: EventPublisher,
      private readonly httpService: HttpService
    ){}

    async execute({ createEventRequest }: CreateEventCommand){


      const { 
        _id, 
        name, 
        host,
        community,
        description,
        startDate,
        endDate,
        members,
        quiz,
        memo,
        prompt, 
        
      } = createEventRequest;

      const event = this.eventPublisher.mergeObjectContext(
        await this.eventFactory.create(
            _id, 
            name, 
            host,
            community,
            description,
            startDate,
            endDate,
            members,
            quiz,
            memo,
            prompt, 
        )
      );

      event.commit();
      
    

      return event;
    }
  }