import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommunityRequestSchema } from "./community-request.schema";

@Injectable()
export class CommunityRequestDtoRepository{
  constructor(
    @InjectModel(CommunityRequestSchema.name)
    private readonly communityRequestModel: Model<CommunityRequestSchema>
  ){}

  async findById(id: string){
    return await this.communityRequestModel.findOne({_id: id})
  }
}