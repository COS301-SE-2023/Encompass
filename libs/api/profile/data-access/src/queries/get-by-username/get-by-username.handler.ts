import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetByUsernameQuery } from "./get-by-username.query";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@QueryHandler(GetByUsernameQuery)
export class GetByUsernameHandler implements IQueryHandler<GetByUsernameQuery> {
  constructor(private readonly profileEntityRepository: ProfileEntityRepository) {}

  async execute({ username }: GetByUsernameQuery){
    return this.profileEntityRepository.findOneByUsername(username);
  }
}