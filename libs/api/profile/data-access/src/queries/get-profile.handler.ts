import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetProfileQuery } from "./get-profile.query";
import { ProfileEntityRepository } from "../db/profile-entity.repository";

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery>{

  constructor(private readonly profileEntityRepository: ProfileEntityRepository){}

  async execute({ userId }: GetProfileQuery){
    // console.log(userId)
    return this.profileEntityRepository.findOneById(userId);
  }
}