import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentSchema } from "./comment.schema";

@Injectable()
export class CommentDtoRepository {
  constructor(
    @InjectModel(CommentSchema.name)
    private readonly commentModel: Model<CommentSchema>,
  ){}

  async findAll(){
    return await this.commentModel.find();
  }

  async findById(id: string){
    return await this.commentModel.findOne({ _id: id });
  }

  async findByPostId(postId: string){
    return await this.commentModel.find({ postId: postId });
  }
}