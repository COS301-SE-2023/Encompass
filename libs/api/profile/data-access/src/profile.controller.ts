import { Body, Controller, Get, Post, Param } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProfileRequest } from "./dto";
import { CreateProfileCommand } from "./commands/create-profile.command";
import { Profile } from "./profile";
import { GetProfileQuery } from "./queries/get-profile.query";
import { ProfileDto } from "./profile.dto";

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
  async getProfile(@Param('id') userId: string){
    return await this.queryBus.execute<GetProfileQuery, ProfileDto>(
      new GetProfileQuery(userId),
    );
  }
}