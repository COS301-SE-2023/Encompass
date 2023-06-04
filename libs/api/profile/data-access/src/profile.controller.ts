import { Body, Controller, Get, Post, Param, Patch } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProfileRequest, UpdateProfileRequest } from "./dto";
import { CreateProfileCommand } from "./commands/create-profile/create-profile.command";
import { Profile } from "./profile";
import { GetProfileQuery } from "./queries/get-profile.query";
import { ProfileDto } from "./profile.dto";
import { UpdateProfileCommand } from "./commands/update-profile/update-profile.command";
import { GetUsernameQuery } from "./queries/get-username/get-username.query";

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

  @Get(':id')
  async getProfile(@Param('id') userId: string) : Promise<ProfileDto>{
    return await this.queryBus.execute<GetProfileQuery, ProfileDto>(
      new GetProfileQuery(userId),
    );
  }

  @Patch(':id')
  async updateProfile(
    @Param('id') userId: string, 
    @Body() profile: UpdateProfileRequest){
      return await this.commandBus.execute<UpdateProfileCommand, ProfileDto>(
        new UpdateProfileCommand(userId, profile),
      )
  }

  @Get('/user/:username')
  async getProfileByUsername(@Param('username') username: string){
    return await this.queryBus.execute<GetUsernameQuery, boolean>(
      new GetUsernameQuery(username),
    );
  }
}