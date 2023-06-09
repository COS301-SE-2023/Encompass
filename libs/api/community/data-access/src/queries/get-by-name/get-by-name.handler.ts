import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetByNameQuery } from "./get-by-name.query";
import { CommunityDtoRepository } from "../../db/community-dto.repository";

@QueryHandler(GetByNameQuery)
export class GetByNameHandler implements IQueryHandler<GetByNameQuery>{
  constructor(
    private readonly communityRepository: CommunityDtoRepository
  ){}

  async execute({ name }: GetByNameQuery){
    return await this.communityRepository.getByName(name);
  }
}