import { Body , Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommunityRequest, UpdateCommunityRequest } from './dto';
import { CreateCommunityCommand } from './commands/create-community.command';
import { Community } from './community';
import { GetCommunityQuery } from './queries/get-community.query';
import { CommunityDto } from './community.dto';
import { UpdateCommunityCommand } from './commands/update-community/update-community.command';


@Controller('community')
export class CommunityController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Get(':id')
    async getCommunity(@Param('id') id: string): Promise<CommunityDto> {
        return await this.queryBus.execute<GetCommunityQuery, CommunityDto>(
            new GetCommunityQuery(id),
        );
    }

    @Post('create')
    async createCommunity(
        @Body() createCommunityRequest: CreateCommunityRequest,
    ) {
        return await this.commandBus.execute<CreateCommunityCommand, string>(
            new CreateCommunityCommand(createCommunityRequest),
        );
    }

    @Patch('update/:id')
    async updateCommunity(
        @Param('id') communityId: string,
        @Body() community: UpdateCommunityRequest) {
        return await this.commandBus.execute<UpdateCommunityCommand, CommunityDto>(
            new UpdateCommunityCommand(communityId, community),
        );
    }
}