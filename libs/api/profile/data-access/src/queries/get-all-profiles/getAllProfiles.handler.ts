import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ProfileDtoRepository } from "../../db/profile-dto.repository";
import { GetAllProfilesQuery } from "./getAllProfiles.query";

@QueryHandler(GetAllProfilesQuery)
export class GetAllProfilesHandler implements IQueryHandler<GetAllProfilesQuery> {
  constructor(private readonly profileDtoRepository: ProfileDtoRepository) {}

  async execute() {
    return await this.profileDtoRepository.findAll();
  }
}