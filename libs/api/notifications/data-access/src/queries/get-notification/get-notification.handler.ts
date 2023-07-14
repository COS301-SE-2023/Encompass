import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetNotificationQuery } from "./get-notification.query";
import { NotificationEntityRepository } from "../../db/notification-entity.repository";

@QueryHandler(GetNotificationQuery)
export class GetNotificationHandler implements IQueryHandler<GetNotificationQuery>{
  constructor(private notificationEntityRepository: NotificationEntityRepository){}

  async execute(query: GetNotificationQuery){
    return await this.notificationEntityRepository.findOneById(query.id);
  }
}