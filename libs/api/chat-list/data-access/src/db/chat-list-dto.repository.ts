import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatListSchema } from "./chat-list.schema";

@Injectable()
export class ChatListDtoRepository {
  constructor(
    @InjectModel(ChatListSchema.name)
    private readonly chatListModel: Model<ChatListSchema>,
  ){}

  async findAll(){
    return await this.chatListModel.find();
  }

  async findById(id: string){
    return await this.chatListModel.findOne({ _id: id });
  }
}