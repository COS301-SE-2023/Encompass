import { Controller, Get, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { QueryBus } from '@nestjs/cqrs';
import { HomeDto } from './home.dto'
import { HomeQuery } from './queries/home.query'

@Controller('home')
export class HomeController{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // @Get(':id')
  // async getHome(@Param('id') id: string) : Promise<void> {}

  @Get()
  async getCampers(): Promise<HomeDto[]> {
    console.log("In API")
    return this.queryBus.execute<HomeQuery, HomeDto[]>(new HomeQuery());
  }
}