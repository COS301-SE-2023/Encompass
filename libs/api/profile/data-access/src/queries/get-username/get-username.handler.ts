import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUsernameQuery } from "./get-username.query";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@QueryHandler(GetUsernameQuery)
export class GetUsernameHandler implements IQueryHandler<GetUsernameQuery>{

  constructor(private readonly profileEntityRepository: ProfileEntityRepository){}

  async execute({ username }: GetUsernameQuery){
    try
    {
      const profile = await this.profileEntityRepository.findOneByUsername(username);
      
      if(profile == null || profile == undefined)
        return false;
      else
        return true;
    }

    catch (e)
    {
      // console.log(e)
      return false;
    } 
  }
}