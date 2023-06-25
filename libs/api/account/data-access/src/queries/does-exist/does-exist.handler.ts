/*
FILENAME: does-exist.handler.ts

AUTHOR: Sameet Keshav

CREATION DATE: 27 May 2023

DESCRIPTION: This file checks if an account asssociated with an email exists or not.
*/

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DoesExistQuery } from "./does-exist.query";
import { AccountEntityRepository } from "../../db/account-entity.repository";

@QueryHandler(DoesExistQuery)
export class DoesExistHandler implements IQueryHandler<DoesExistQuery>{

  constructor(private readonly accountEntityRepository: AccountEntityRepository){}

  async execute({ email }: DoesExistQuery){
    console.log(email)
    
    try{
      const account = await this.accountEntityRepository.findOneByEmail(email);
    //console.log(account._id)

      if(account == null || account == undefined)
        return false;
      else
        return true;
    }

    catch(e){
      // console.log(e)
      return false;
    }
  }
}