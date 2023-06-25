import { Body , Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommunityRequest, UpdateCommunityRequest } from './dto';
import { CreateCommunityCommand } from './commands/create-community.command';
import { Community } from './community';
import { GetCommunityQuery } from './queries/get-community.query';
import { CommunityDto } from './community.dto';
import { UpdateCommunityCommand } from './commands/update-community/update-community.command';
import { DoesExistQuery } from './queries/does-exist/does-exist.query';
import { AddPostCommand } from './commands/add-post/add-post.command';
import { GetByNameQuery } from './queries/get-by-name/get-by-name.query';


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

    @Get('get-community/:name')
    async getCommunityByName(@Param('name') name: string): Promise<CommunityDto> {
        return await this.queryBus.execute<GetByNameQuery, CommunityDto>(
            new GetByNameQuery(name),
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

    @Patch(':id')
    async updateCommunity(
        @Param('id') communityId: string,
        @Body() community: UpdateCommunityRequest) {
        return await this.commandBus.execute<UpdateCommunityCommand, CommunityDto>(
            new UpdateCommunityCommand(communityId, community),
        );
    }

    @Get('does-exist/:name')
    async getDoesExist(
        @Param('name') communityName: string
    ){
        return await this.queryBus.execute<DoesExistQuery, boolean>(
            new DoesExistQuery(communityName)
        )
    }

    @Patch('add-post/:name/:post')
    async addPost(
        @Param('name') communityName: string,
        @Param('post') post: string
    ){
        return await this.commandBus.execute<AddPostCommand, CommunityDto>(
            new AddPostCommand(communityName, post)
        )
    }
}