import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProfileSchema } from "./profile.schema";
import { Model } from "mongoose";
import { ProfileDto } from "../profile.dto";
import { ObjectId } from "mongodb";
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


  async findTop20Profiles(): Promise<ProfileDto[]>{
    const profiles = await this.profileModel.find().sort({ ep: -1 }).limit(20);
    return profiles.map(profile => ({
      ...profile.toJSON(),
      _id: (profile._id as ObjectId).toString(),
    }));
  }
}