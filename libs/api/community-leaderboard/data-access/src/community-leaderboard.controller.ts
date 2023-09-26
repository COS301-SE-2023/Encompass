import { Controller, Get, Patch } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CommunityLeaderboardDto } from "./community-leaderboard.dto";
import { SetLeaderboardCommand } from "./commands/set-leaderboard/set-leaderboard.command";
import { GetLeaderboardQuery } from "./queries/get-leaderboard/get-leaderboard.query";

@Controller('community-leaderboard')
export class CommunityLeaderboardController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ){}

  @Get('leaderboard')
  async getLeaderboard(){
    return await this.queryBus.execute<GetLeaderboardQuery, CommunityLeaderboardDto[]>(
      new GetLeaderboardQuery(),
    );
  }

  @Patch('leaderboard')
  async setLeaderboard(){
    return await this.commandBus.execute<SetLeaderboardCommand, CommunityLeaderboardDto[]>(
      new SetLeaderboardCommand(),
    );
  }
}