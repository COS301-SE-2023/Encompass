import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetByUsernameQuery } from "./get-by-username.query";
import { EventDtoRepository } from "../../db/event-dto.repository";

@QueryHandler(GetByUsernameQuery)
export class GetByUsernameHandler implements IQueryHandler<GetByUsernameQuery>{
  constructor(private readonly eventDtoRepository: EventDtoRepository){}

  async execute(query: GetByUsernameQuery){
    return await this.eventDtoRepository.getEventsByUsername(query.username);
  }
}