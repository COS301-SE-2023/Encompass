import { AddNotificationRequest } from "../../dto";

export class AddNotificationCommand{
  constructor(public readonly id: string, public readonly addNotificationRequest: AddNotificationRequest){}
}