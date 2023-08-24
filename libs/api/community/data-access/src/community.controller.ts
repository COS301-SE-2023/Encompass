import { Body , Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CommunityLeaderboardDto, CreateCommunityRequest, UpdateCommunityRequest } from './dto';
import { CreateCommunityCommand } from './commands/create-community.command';
import { Community } from './community';
import { GetCommunityQuery } from './queries/get-community.query';
import { GetRecommendedCommunitiesQuery } from './queries/recommended/get-recommended-communities.query'
import { CommunityDto } from './community.dto';
import { UpdateCommunityCommand } from './commands/update-community/update-community.command';
import { DoesExistQuery } from './queries/does-exist/does-exist.query';
import { AddPostCommand } from './commands/add-post/add-post.command';
import { GetByNameQuery } from './queries/get-by-name/get-by-name.query';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Multer } from 'multer';
import { UploadedFile } from '@nestjs/common';
import { UploadImage } from './upload-image.service';
import { DeleteCommunityCommand } from './commands/delete-community/delete-community.command';
import { RemovePostCommand } from './commands/remove-post/remove-post.command';
import { RemoveUserCommand } from './commands/remove-user/remove-user.command';
import { GetCommunitiesByKeyWordQuery } from './queries/community-search/get-community-by-keyword.query';
import { GetAllCommunitiesQuery } from './queries/get-all-communities/getAllCommunities.query';
import { AddCoinsCommand } from './commands/add-coins/add-coins.command';
import { RemoveCoinsCommand } from './commands/remove-coins/remove-coins.command';
import { AddEventCommand } from './commands/add-event/add-event.command';
import { GetLeaderboardQuery } from './queries/get-leaderboard/get-leaderboard.query';
import { UpdateLeaderboardCommand } from './commands/update-leaderboard/update-leaderboard.command';



@Controller('community')
export class CommunityController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Get('get-all-communities')
    async getAllCommunities(): Promise<CommunityDto[]> {
        return await this.queryBus.execute<GetAllCommunitiesQuery, CommunityDto[]>(
            new GetAllCommunitiesQuery(),
        );
    }

    @Get('get-communities-by-keyword/:keyword')
    async getCommunitiesByKeyword(@Param('keyword') keyword: string){
        return await this.queryBus.execute<GetCommunitiesByKeyWordQuery, CommunityDto[]>(
            new GetCommunitiesByKeyWordQuery(keyword),
        );
    }

    @Get('leaderboard')
    async getLeaderboard() {
        return await this.queryBus.execute<GetLeaderboardQuery, CommunityLeaderboardDto[]>(
            new GetLeaderboardQuery(),
        );
    }

    @Get('get-recommended-communities/:userid/:username')
    async getRecommendedCommunities(@Param('username') username: string, @Param('userid') userId: string): Promise<CommunityDto[]> {
        return await this.queryBus.execute<GetRecommendedCommunitiesQuery, CommunityDto[]>(
            new GetRecommendedCommunitiesQuery(username, userId),
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

    @Patch('leaderboard')
    async updateLeaderboard(){
        return await this.commandBus.execute<UpdateLeaderboardCommand, CommunityLeaderboardDto[]>(
            new UpdateLeaderboardCommand()
        )
    }

    @Patch('add-coins/:name/:coins')
    async addCoins(
        @Param('name') communityName: string,
        @Param('coins') coins: number
    ){
        return await this.commandBus.execute<AddCoinsCommand, CommunityDto>(
            new AddCoinsCommand(communityName, coins)
        )
    }

    @Patch('remove-coins/:name/:coins')
    async removeCoins(
        @Param('name') communityName: string,
        @Param('coins') coins: number
    ){
        return await this.commandBus.execute<RemoveCoinsCommand, CommunityDto>(
            new RemoveCoinsCommand(communityName, coins)
        )
    }

    @Patch('add-event/:name/:event')
    async addEvent(
        @Param('name') communityName: string,
        @Param('event') event: string
    ){
        return await this.commandBus.execute<AddEventCommand, CommunityDto>(
            new AddEventCommand(communityName, event)
        )
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

    @Patch('remove-post/:name/:post')
    async removePost(
        @Param('name') communityName: string,
        @Param('post') post: string
    ){
        return await this.commandBus.execute<RemovePostCommand, CommunityDto>(
            new RemovePostCommand(communityName, post)
        )
    }

    @Patch('remove-user/:name/:user')
    async removeUser(
        @Param('name') communityName: string,
        @Param('user') username: string
    ){
        return await this.commandBus.execute<RemoveUserCommand, CommunityDto>(
            new RemoveUserCommand(username, communityName)
        )
    }

    @Delete('delete/:name')
    async deleteCommunity(
        @Param('name') communityName: string
    ){
        return await this.commandBus.execute<DeleteCommunityCommand, string>(
            new DeleteCommunityCommand(communityName)
        )
    }

    

    @Post('upload-image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    ){
        console.log("Here")
        const uploadImage = new UploadImage();
        return await uploadImage.uploadImage(file.buffer, file.originalname);
    }

    @Patch(':id')
    async updateCommunity(
        @Param('id') communityId: string,
        @Body() community: UpdateCommunityRequest) {
        return await this.commandBus.execute<UpdateCommunityCommand, CommunityDto>(
            new UpdateCommunityCommand(communityId, community),
        );
    }

    /*@Get(':id')
    async getCommunity(@Param('id') id: string): Promise<CommunityDto> {
        return await this.queryBus.execute<GetCommunityQuery, CommunityDto>(
            new GetCommunityQuery(id),
        );
    }*/
}