import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetByIdQuery } from "./get-by-id.query";
// import { EventDtoRepository } from "../../db/event-dto.repository";
import { EventEntityRepository } from "../../db/event-entity.repository";

@QueryHandler(GetByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetByIdQuery>{
  constructor(private eventEntityRepository: EventEntityRepository) {}

  async execute(query: GetByIdQuery) {
    return await this.eventEntityRepository.findOneById(query.id);
  }
}