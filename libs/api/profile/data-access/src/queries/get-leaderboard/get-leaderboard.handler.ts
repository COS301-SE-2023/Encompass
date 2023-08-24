import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLeaderboardQuery } from "./get-leaderboard.query";
import * as fs from 'fs';
import { leaderboardDto } from "../../dto/leaderboard.dto";

@QueryHandler(GetLeaderboardQuery)
export class GetLeaderboardHandler implements IQueryHandler{
  async execute(){
    const file = await fs.promises.readFile(process.cwd() + '/libs/api/profile/data-access/src/leaderboard.json', 'utf-8')
    const leaderboard: leaderboardDto[] = file ? JSON.parse(file) : [];
    

    return leaderboard;
  }
}