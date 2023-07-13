import { Controller, Param, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { NotificationDto } from "./notification.dto";
import { CreateNotificationCommand } from "./commands/create-notification/create-notification.command";

@Controller('notification')
export class NotificationController{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ){}

  @Post('create/:id')
  async createNotification(
    @Param('id') id: string
  ){
    return await this.commandBus.execute<CreateNotificationCommand, NotificationDto>(
      new CreateNotificationCommand(id)
    )
  }
}