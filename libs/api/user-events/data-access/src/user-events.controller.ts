import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { UserEventsDto } from "./user-events.dto";
import { CreateUserEventsCommand } from "./commands/create-events/create-user-events.command";
import { GetUserEventsQuery } from "./queries/get-user-events/get-user-events.query";
import { AddEventCommand } from "./commands/add-event/add-event.command";
import { UpdateEventRequest } from "./dto";
import { UpdateEventCommand } from "./commands/update-event/update-event.command";

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

  @Patch('add-event/:userId/:eventId')
  async addEvent(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string
  ){
    return await this.commandBus.execute<AddEventCommand, UserEventsDto>(
      new AddEventCommand(userId, eventId)
    )
  }

  @Patch('update-event/:userId')
  async updateEvent(
    @Param('userId') userId: string,
    @Body() updateEventRequest: UpdateEventRequest
  ){
    return await this.commandBus.execute<UpdateEventCommand, UserEventsDto>(
      new UpdateEventCommand(userId, updateEventRequest)
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