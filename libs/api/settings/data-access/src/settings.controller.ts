import { Controller, Param, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateSettingsCommand } from "./commands/create-settings/create-settings.command";

@Controller('settings')
export class SettingsController{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ){}

  @Post('create/:userId')
  async createSettings(
    @Param('userId') userId: string
  ){
    return await this.commandBus.execute<CreateSettingsCommand, string>(
      new CreateSettingsCommand(userId)
    );
  }
}