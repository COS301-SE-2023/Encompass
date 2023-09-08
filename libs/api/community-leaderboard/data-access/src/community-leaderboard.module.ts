import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule, SchemaFactory } from "@nestjs/mongoose";
import { CommunityLeaderboardSchema } from "./db/community-leaderboard.schema";
import { CommunityLeaderboardController } from "./community-leaderboard.controller";
import { CommunityLeaderboardDtoRepository } from "./db/community-leaderboard-dto.repository";
import { CommunityLeaderboardSchemaFactory } from "./db/community-leaderboard-schema.factory";
import { CommunityLeaderboardEntityRepository } from "./db/community-leaderboard-entity.repository";
import { CommunityLeaderboardFactory } from "./community-leaderboard.factory";
import { GetLeaderboardHandler } from "./queries";
import { SetLeaderboardHandler } from "./commands";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: CommunityLeaderboardSchema.name,
        schema: SchemaFactory.createForClass(CommunityLeaderboardSchema),
      }
    ]),
    HttpModule
  ],
  controllers: [CommunityLeaderboardController],
  providers: [
    CommunityLeaderboardEntityRepository,
    CommunityLeaderboardDtoRepository,
    CommunityLeaderboardSchemaFactory,
    CommunityLeaderboardFactory,
    GetLeaderboardHandler,
    SetLeaderboardHandler
  ]
})
export class CommunityLeaderboardModule {}