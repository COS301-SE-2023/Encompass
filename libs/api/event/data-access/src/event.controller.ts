import { Body, Controller, Get, Post, Param, Patch } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateEventRequest, UpdateEventRequest } from "./dto";
import { Event } from "./event";
import { EventDto } from "./event.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { UseInterceptors } from "@nestjs/common";
import { Request } from "express";
import { Multer } from "multer";
import { GetByUsernameQuery} from "./queries/get-by-username/get-by-username.query"
import { GetByIdQuery } from "./queries/get-by-id/get-by-id.query";
import { GetByCommunityQuery } from "./queries/get-by-community/get-by-community.query";
import { CreateEventCommand } from "./commands/create-event/create-event.command";

@Controller('event')
export class EventController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ){}

  @Post('create')
  async createEvent(
    @Body() createEventRequest:CreateEventRequest,){
        return await this.commandBus.execute<CreateEventCommand, string>(
            new CreateEventCommand(createEventRequest),
        );
    }

    @Get('get-by-user/:username')
    async getPostsByUserId(
      @Param('username') username: string,
    ){
      return await this.queryBus.execute<GetByUsernameQuery, EventDto[]>(
        new GetByUsernameQuery(username),
      );
    }
  
    @Get('get-by-community/:communityName')
    async getEventsByCommunity(
      @Param('communityName') communityName: string,
    ){
      return await this.queryBus.execute<GetByCommunityQuery, EventDto[]>(
        new GetByCommunityQuery(communityName),
      );
    }
  
    @Get(':id')
    async getPostById(
      @Param('id') id: string,
    ){
      return await this.queryBus.execute<GetByIdQuery, EventDto>(
        new GetByIdQuery(id),
      );
    }


  

 

  
}