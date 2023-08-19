import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserEventsSchema } from "./user-events.schema";
import { Model } from "mongoose";

@Injectable()
export class UserEventsDtoRepository{
  constructor(
    @InjectModel(UserEventsSchema.name)
    private readonly userEventsModel: Model<UserEventsSchema>
  ){}

  async findById(id: string){
    return await this.userEventsModel.findOne({_id: id})
  }
}