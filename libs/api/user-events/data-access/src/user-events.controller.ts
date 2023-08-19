import { Controller, Param, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { UserEventsDto } from "./user-events.dto";
import { CreateUserEventsCommand } from "./commands/create-events/create-user-events.command";

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
}