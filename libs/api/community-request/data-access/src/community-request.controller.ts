import { Controller, Param, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CommunityRequestDto } from "./community-request.dto";
import { CreateCommunityRequestCommand } from "./commands/create-community-request.command";

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
}