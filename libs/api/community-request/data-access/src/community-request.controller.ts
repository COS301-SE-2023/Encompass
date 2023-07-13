import { Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CommunityRequestDto } from "./community-request.dto";
import { CreateCommunityRequestCommand } from "./commands/create-community-request.command";
import { GetCommunityRequestQuery } from "./queries/get-commuity-request.query";
import { AddUserCommand } from "./commands/add-user/add-user.command";
import { RemoveUserCommand } from "./commands/remove-user/remove-user.command";

@Controller('community-request')
export class CommunityRequestController{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ){}

  @Post('create/:communityId')
  async create(
    @Param('communityId') communityId: string
  ){
    return await this.commandBus.execute<CreateCommunityRequestCommand, CommunityRequestDto>(
      new CreateCommunityRequestCommand(communityId)
    )
  }

  @Get('find/:id')
  async find(
    @Param('id') id: string
  ){
    return await this.queryBus.execute<GetCommunityRequestQuery, CommunityRequestDto>(
      new GetCommunityRequestQuery(id)
    )
  }

  @Patch('add-user/:communityId/:username')
  async addUser(
    @Param('communityId') communityId: string,
    @Param('username') username: string
  ){
    return await this.commandBus.execute<AddUserCommand, CommunityRequestDto>(
      new AddUserCommand(communityId, username)
    )
  }

  @Patch('remove-user/:communityId/:username')
  async removeUser(
    @Param('communityId') communityId: string,
    @Param('username') username: string
  ){
    return await this.commandBus.execute<RemoveUserCommand, CommunityRequestDto>(
      new RemoveUserCommand(communityId, username)
    )
  }
}