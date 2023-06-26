import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DoesExistQuery } from "./does-exist.query";
import { CommunityEntityRepository } from "../../db/community-entity.repository";

@QueryHandler(DoesExistQuery)
export class DoesExistHandler implements IQueryHandler<DoesExistQuery>{
  constructor(private readonly communityEntityRepository: CommunityEntityRepository){}

  async execute({name}: DoesExistQuery){
      try{
        const community = await this.communityEntityRepository.findOneByName(name);

        if(community == null || community == undefined){
          return false;
        }

        else{
          return true;
        }
      }

      catch(error){
        return false;
      }

  }
}