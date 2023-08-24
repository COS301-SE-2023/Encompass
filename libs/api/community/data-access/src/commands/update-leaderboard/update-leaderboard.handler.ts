import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateLeaderboardCommand } from "./update-leaderboard.command";
import * as fs from 'fs';
import { CommunityLeaderboardDto } from "../../dto";
import { CommunityDto } from "../../community.dto";
import { CommunityDtoRepository } from "../../db/community-dto.repository";

@CommandHandler(UpdateLeaderboardCommand)
export class UpdateLeaderboardHandler implements ICommandHandler<UpdateLeaderboardCommand>{
  constructor(
    private readonly communityDtoRepository: CommunityDtoRepository,
  ){}
  async execute(){
    const newLeaderboard: CommunityLeaderboardDto[] = [];

    const communities: CommunityDto[] = await this.communityDtoRepository.findTopCommunities()
    let counter = 1;

    communities.forEach(community => {
      newLeaderboard.push({
        name: community.name,
        communityEP: community.communityEP,
        position: counter++
      })
    })

    const newFile = JSON.stringify(newLeaderboard);

    await fs.promises.writeFile(process.cwd() + '/libs/api/profile/data-access/src/leaderboard.json', newFile, 'utf-8');
    return newLeaderboard;
  }
}