import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProfileRequest } from "./dto";
import { CreateProfileCommand } from "./commands/create-profile.command";
import { ProfileDto } from "./profile.dto";
import { Profile } from "./profile";

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
}