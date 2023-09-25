import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
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
import { SearchModule } from '@encompass/api/search/data-access';

const NX_MONGO_DB_URL = process.env['NX_MONGO_DB_TEST']

@Module({
  imports: [
    MongooseModule.forRoot(NX_MONGO_DB_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
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
    // DatabaseModule
  ],
})
export class AppModule {}
