import { NotificationsSettingsDto } from "../../dto";

export class UpdateNotificationsCommand{
  constructor(public readonly userId: string, public readonly notifications: NotificationsSettingsDto){}
}