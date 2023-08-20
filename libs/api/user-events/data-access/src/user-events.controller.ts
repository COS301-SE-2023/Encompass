import { Controller, Get, Param, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { UserEventsDto } from "./user-events.dto";
import { CreateUserEventsCommand } from "./commands/create-events/create-user-events.command";
import { GetUserEventsQuery } from "./queries/get-user-events/get-user-events.query";

@Controller('user-events')
export class UserEventsController{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ){}

  @Post('create/:userId')
  async create(
    @Param('userId') userId: string
  ){
    return await this.commandBus.execute<CreateUserEventsCommand, UserEventsDto>(
      new CreateUserEventsCommand(userId)
    )
  }

  @Get('get/:userId')
  async find(
    @Param('userId') userId: string
  ){
    return await this.queryBus.execute<GetUserEventsQuery, UserEventsDto>(
      new GetUserEventsQuery(userId)
    )
  }
}