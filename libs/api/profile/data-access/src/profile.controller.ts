import { Body, Controller, Get, Post, Param, Patch } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProfileRequest, UpdateProfileRequest } from "./dto";
import { CreateProfileCommand } from "./commands/create-profile/create-profile.command";
import { Profile } from "./profile";
import { GetProfileQuery } from "./queries/get-profile.query";
import { ProfileDto } from "./profile.dto";
import { UpdateProfileCommand } from "./commands/update-profile/update-profile.command";
import { GetUsernameQuery } from "./queries/get-username/get-username.query";
import { RemovePostCommand } from "./commands/remove-post/remove-post.command";
import { RemoveCommunityCommand } from "./commands/remove-community/remove-community.command";
import { GetAllProfilesQuery } from "./queries/get-all-profiles/getAllProfiles.query";

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ){}

  @Post('create')
  async createProfile(
    @Body() createProfileRequest: CreateProfileRequest,
  ) {
    return await this.commandBus.execute<CreateProfileCommand, string>(
      new CreateProfileCommand(createProfileRequest),
    );
  }

  @Get('/get/:id')
  async getProfile(@Param('id') userId: string) : Promise<ProfileDto>{
    return await this.queryBus.execute<GetProfileQuery, ProfileDto>(
      new GetProfileQuery(userId),
    );
  }

  @Get('get-all')
  async getAllProfiles(){
    return await this.queryBus.execute<GetAllProfilesQuery, ProfileDto[]>(
      new GetAllProfilesQuery(),
    );
  }

  @Patch('/update/:id')
  async updateProfile(
    @Param('id') userId: string, 
    @Body() profile: UpdateProfileRequest){
      return await this.commandBus.execute<UpdateProfileCommand, ProfileDto>(
        new UpdateProfileCommand(userId, profile),
      )
  }

  @Patch('remove-post/:username/:postId')
  async removePost(
    @Param('username') username: string,
    @Param('postId') postId: string,
  ){
    return await this.commandBus.execute<RemovePostCommand, ProfileDto>(
      new RemovePostCommand(username, postId),
    );
  }

  @Patch('remove-community/:username/:communityName')
  async removeCommunity(
    @Param('username') username: string,
    @Param('communityName') communityName: string,
  ){
    return await this.commandBus.execute<RemoveCommunityCommand, ProfileDto>(
      new RemoveCommunityCommand(username, communityName),
    );
  }

  @Get('/user/:username')
  async getProfileByUsername(@Param('username') username: string){
    return await this.queryBus.execute<GetUsernameQuery, boolean>(
      new GetUsernameQuery(username),
    );
  }

  @Get('/media/:id')
  async getRecommendedMedia(@Param('id') userId: string) {
    return await this.queryBus.execute<GetRecommendedMediaQuery, string[]>(
      new this.GetRecommendedMediaQuery(userId),
    );
  }
}