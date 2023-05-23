import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { HomeQuery } from "./home.query";
import { HomeDtoRepository } from "../db/home-dto.repository";
import { HomeDto } from "../home.dto";

@QueryHandler(HomeQuery)
export class HomeHandler implements IQueryHandler<HomeQuery>{
  constructor(private readonly homeDtoRepository: HomeDtoRepository){}

  async execute(): Promise<HomeDto[]> {
    return this.homeDtoRepository.findAll();
  }
}