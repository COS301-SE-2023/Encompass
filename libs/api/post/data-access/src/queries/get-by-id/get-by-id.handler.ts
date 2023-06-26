import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetByIdQuery } from "./get-by-id.query";
import { PostDtoRepository } from "../../db/post-dto.repository";
import { PostEntityRepository } from "../../db/post-entity.repository";

@QueryHandler(GetByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetByIdQuery>{
  constructor(private postEntityRepository: PostEntityRepository) {}

  async execute(query: GetByIdQuery) {
    return await this.postEntityRepository.findOneById(query.id);
  }
}