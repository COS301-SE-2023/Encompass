import { Controller, Get, Patch } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetLeaderboardQuery } from "./queries/get-leaderboard/get-leaderboard.query";
import { ProfileLeaderboardDto } from "./profile-leaderboard.dto";
import { SetLeaderboardCommand } from "./commands/set-leaderboard/set-leaderboard.command";

@Controller('profile-leaderboard')
export class ProfileLeaderboardController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ){}

  @Get('leaderboard')
  async getLeaderboard(){
    return await this.queryBus.execute<GetLeaderboardQuery, ProfileLeaderboardDto[]>(
      new GetLeaderboardQuery(),
    );
  }

  @Patch('leaderboard')
  async setLeaderboard(){
    return await this.commandBus.execute<SetLeaderboardCommand, ProfileLeaderboardDto[]>(
      new SetLeaderboardCommand(),
    );
  }
}