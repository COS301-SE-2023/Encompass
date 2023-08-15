import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EventSchema } from "./event.schema";
import { Model } from "mongoose";
import { EventDto } from "../event.dto";
@Injectable()
export class EventDtoRepository{
  constructor(
    @InjectModel(EventSchema.name)
    private readonly eventModel: Model<EventSchema>,
  ) {}

  async findAll(): Promise<EventDto[]>{
    return await this.eventModel.find();
  }

  async findById(id: string){
    return await this.eventModel.findOne({ _id: id });
  }

  async getEventsByUsername(username: string){
    return await this.eventModel.findOne({ username });
  }
}