import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProfileLeaderboardDto } from "../profile-leaderboard.dto";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { ProfileLeaderboardSchema } from "./profile-leaderboard.schema";

@Injectable()
export class ProfileLeaderboardDtoRepository{
  constructor(
    @InjectModel(ProfileLeaderboardSchema.name)
    private readonly profileLeaderboardModel: Model<ProfileLeaderboardSchema>,  
  ) {}

  async findAll(): Promise<ProfileLeaderboardDto[]>{
    return await this.profileLeaderboardModel.find();
  }

  async getLeaderboard(){
    const profiles = await this.profileLeaderboardModel.find().sort({ ep: -1 }).limit(20);
    return profiles.map(profile => ({
      ...profile.toJSON(),
      _id: (profile._id as ObjectId).toString(),
    }));
  }

  async removeAll(){
    await this.profileLeaderboardModel.deleteMany({});
  }

  async insertMany(profiles: ProfileLeaderboardDto[]){
    await this.profileLeaderboardModel.insertMany(profiles);
  }
}