import { Controller, Get, Post, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommunityCommand } from './commands/create-community.command';
import { CreateCommunityRequest } from './dto/create-community-request.dto';
import { GetCommunityRequest } from './dto';
import { GetCommunityCommand } from './queries/community.command';

@Controller('community')
export class CommunityController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Post()
    async createCommunity(
        @Body() createCommunityRequest: CreateCommunityRequest
    ) {
        const data: CreateCommunityRequest = {
            _id: createCommunityRequest._id,
            name: createCommunityRequest.name,
            admin: createCommunityRequest.admin,
            about: createCommunityRequest.about,
            members: createCommunityRequest.members,
            events: createCommunityRequest.events,
            posts: createCommunityRequest.posts,
        };

        return await this.commandBus.execute<CreateCommunityCommand, string>(
            new CreateCommunityCommand(data),
        );
    }

    @Get()
    async getCommunity(
        @Body() getCommunityRequest: GetCommunityRequest
    ) : Promise<string> {
        return await this.commandBus.execute<GetCommunityCommand, string>(
            new GetCommunityCommand(getCommunityRequest._id, getCommunityRequest.name, getCommunityRequest.admin, getCommunityRequest.about, getCommunityRequest.members, getCommunityRequest.events, getCommunityRequest.posts),
        );
    }
}