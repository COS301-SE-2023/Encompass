import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CommunityLeaderboardDto } from "../community-leaderboard.dto";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { CommunityLeaderboardSchema } from "./community-leaderboard.schema";

@Injectable()
export class CommunityLeaderboardDtoRepository{
  constructor(
    @InjectModel(CommunityLeaderboardSchema.name)
    private readonly communityLeaderboardModel: Model<CommunityLeaderboardSchema>,
  ){}

  async findAll(): Promise<CommunityLeaderboardDto[]>{
    return await this.communityLeaderboardModel.find();
  }

  async getLeaderboard(){
    const communities = await this.communityLeaderboardModel.find().sort({ ep: -1 });
    return communities.map(community => ({
      ...community.toJSON(),
      _id: (community._id as ObjectId).toString(),
    }));
  }

  async removeAll(){
    await this.communityLeaderboardModel.deleteMany();
  }

  async insertMany(communities: CommunityLeaderboardDto[]){
    await this.communityLeaderboardModel.insertMany(communities);
  }
}