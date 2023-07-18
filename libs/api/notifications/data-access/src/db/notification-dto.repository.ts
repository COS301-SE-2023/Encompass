import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NotificationSchema } from "./notification.schema";

@Injectable()
export class NotificationDtoRepository{
  constructor(
    @InjectModel(NotificationSchema.name)
    private readonly notificationModel: Model<NotificationSchema>
  ){}

  async findById(id: string){
    return await this.notificationModel.findOne({_id: id})
  }
}