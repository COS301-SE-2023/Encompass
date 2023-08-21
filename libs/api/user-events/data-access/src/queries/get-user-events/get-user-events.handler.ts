import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserEventsQuery } from "./get-user-events.query";
import { UserEventsEntityRepository } from "../../db/user-events-entity.repository";

@QueryHandler(GetUserEventsQuery)
export class GetUserEventsHandler implements IQueryHandler<GetUserEventsQuery>{
  constructor(
    private userEventsEntityRepository: UserEventsEntityRepository
  ){}

  async execute({userId}: GetUserEventsQuery) {
    return this.userEventsEntityRepository.findOneById(userId)
  }
} 