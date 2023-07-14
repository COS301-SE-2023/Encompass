import { Body, Controller, Get, Param, Post, Patch } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { NotificationDto } from "./notification.dto";
import { CreateNotificationCommand } from "./commands/create-notification/create-notification.command";
import { GetNotificationQuery } from "./queries/get-notification/get-notification.query";
import { AddNotificationRequest } from "./dto/add-notification-request.dto";
import { AddNotificationCommand } from "./commands/add-notification/add-notification.command";
import { RemoveNotificationCommand } from "./commands/remove-notification/remove-notification.command";

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

  @Get('get/:id')
  async getNotification(
    @Param('id') id: string
  ){
    return await this.queryBus.execute<GetNotificationQuery, NotificationDto>(
      new GetNotificationQuery(id)
    )
  }

  @Patch('add/:id')
  async addNotification(
    @Param('id') id: string,
    @Body() addNotificationRequest: AddNotificationRequest
  ){
    return await this.commandBus.execute<AddNotificationCommand, NotificationDto>(
      new AddNotificationCommand(id, addNotificationRequest)
    )
  }

  @Patch('remove/:id/:notificationId')
  async removeNotification(
    @Param('id') id: string,
    @Param('notificationId') notificationId: string
  ){
    return await this.commandBus.execute<RemoveNotificationCommand, NotificationDto>(
      new RemoveNotificationCommand(id, notificationId)
    )
  }

}