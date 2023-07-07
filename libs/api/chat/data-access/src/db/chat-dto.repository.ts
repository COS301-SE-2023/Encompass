import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatSchema } from "./chat.schema";

@Injectable()
export class ChatDtoRepository {
  constructor(
    @InjectModel(ChatSchema.name)
    private readonly chatModel: Model<ChatSchema>,
  ){}

  async findAll(){
    return await this.chatModel.find();
  }

  async findById(id: string){
    return await this.chatModel.findOne({ _id: id });
  }
}