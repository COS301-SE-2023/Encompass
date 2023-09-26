import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from '@encompass/api/account/data-access';
import { ProfileModule } from '@encompass/api/profile/data-access';
import { PostModule } from '@encompass/api/post/data-access';
import { CommentModule } from '@encompass/api/comment/data-access';
import { CommunityModule } from '@encompass/api/community/data-access';
// import { DatabaseModule } from '../dbTest/database.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from '@encompass/api/chat/data-access';
import { ChatListModule } from '@encompass/api/chat-list/data-access';
import { CommunityRequestModule } from '@encompass/api/community-request/data-access';
import { NotificationModule } from '@encompass/api/notifications/data-access';
import { MediaRecommenderModule } from '@encompass/api/media-recommender/data-access';
import { SettingsModule } from '@encompass/api/settings/data-access';
import {ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';
import { SearchModule } from '@encompass/api/search/data-access';
import { EventModule } from '@encompass/api/event/data-access';
import { UserEventsModule } from '@encompass/api/user-events/data-access';
import { ProfileLeaderboardModule } from '@encompass/api/profile-leaderboard/data-access';
import { CommunityLeaderboardModule } from '@encompass/api/community-leaderboard/data-access';

const NX_MONGO_DB_URL = process.env['NX_MONGO_DB_URL']

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'encompass'),
      // exclude: ['/api*'],
    }),

    MongooseModule.forRoot(NX_MONGO_DB_URL),
    ProfileLeaderboardModule,
    AccountModule,
    ProfileModule,
    PostModule,
    CommentModule,
    CommunityModule,
    ChatModule,
    ChatListModule,
    CommunityRequestModule,
    NotificationModule,
    MediaRecommenderModule,
    SettingsModule,
    SearchModule,
    EventModule,
    UserEventsModule,
    CommunityLeaderboardModule,
    // DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
