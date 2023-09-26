import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule, SchemaFactory } from "@nestjs/mongoose";
import { ProfileLeaderboardSchema } from "./db/profile-leaderboard.schema";
import { ProfileLeaderboardController } from "./profile-leaderboard.controller";
import { ProfileLeaderboardEntityRepository } from "./db/profile-leaderboard-entity.repository";
import { ProfileLeaderboardDtoRepository } from "./db/profile-leaderboard-dto.repository";
import { ProfileLeaderboardSchemaFactory } from "./db/profile-leaderboard-schema.factory";
import { ProfileLeaderboardFactory } from "./profile-leaderboard.factory";
import { GetLeaderboardHandler } from "./queries";
import { SetLeaderboardCommandHandler } from "./commands";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: ProfileLeaderboardSchema.name,
        schema: SchemaFactory.createForClass(ProfileLeaderboardSchema),
      }
    ]),
    HttpModule
  ],
  controllers: [ProfileLeaderboardController],
  providers: [
    ProfileLeaderboardEntityRepository,
    ProfileLeaderboardDtoRepository,
    ProfileLeaderboardSchemaFactory,
    ProfileLeaderboardFactory,
    GetLeaderboardHandler,
    SetLeaderboardCommandHandler
  ]
})

export class ProfileLeaderboardModule {}