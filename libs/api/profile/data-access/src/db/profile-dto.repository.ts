import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProfileSchema } from "./profile.schema";
import { Model } from "mongoose";
import { ProfileDto } from "../profile.dto";
@Injectable()
export class ProfileDtoRepository{
  constructor(
    @InjectModel(ProfileSchema.name)
    private readonly profileModel: Model<ProfileSchema>,
  ) {}

  async findAll(): Promise<ProfileDto[]>{
    return await this.profileModel.find();
  }

  async findById(id: string){
    return await this.profileModel.findOne({ _id: id });
  }
}