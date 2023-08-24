import { QueryHandler } from "@nestjs/cqrs";
import { GetLeaderboardQuery } from "./get-leaderboard.query";
import * as fs from 'fs';
import { CommunityLeaderboardDto } from "../../dto";

@QueryHandler(GetLeaderboardQuery)
export class GetLeaderboardHandler{
  async execute(){
    const file = await fs.promises.readFile(process.cwd() + '/libs/api/community/data-access/src/leaderboard.json', 'utf-8')
    const leaderboard: CommunityLeaderboardDto[] = file ? JSON.parse(file) : [];
    
    return leaderboard;
  }
}