import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PostSchema } from "./post.schema";
import { Model } from "mongoose";

@Injectable()
export class PostDtoRepository{
  constructor(
    @InjectModel(PostSchema.name)
    private readonly postModel: Model<PostSchema>,
  ){}

  async findAll(){
    return await this.postModel.find();
  }

  async findById(id: string){
    return await this.postModel.findOne({ _id: id });
  }
}