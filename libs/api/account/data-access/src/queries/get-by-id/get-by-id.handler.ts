import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetByIdQuery } from "./get-by-id.query";
import { AccountEntityRepository } from "../../db/account-entity.repository";

@QueryHandler(GetByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetByIdQuery>{
  constructor(private accountEntityRepository: AccountEntityRepository){}

  async execute({id}: GetByIdQuery){
    return await this.accountEntityRepository.findOneById(id);
  }
}