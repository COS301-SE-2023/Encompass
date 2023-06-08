import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeModule } from '@encompass/api/home/data-access';
import { AccountModule } from '@encompass/api/account/data-access';
import { ProfileModule } from '@encompass/api/profile/data-access';
import { PostModule } from '@encompass/api/post/data-access';
import { CommentModule } from '@encompass/api/comment/data-access';

const NX_MONGO_DB_URL = process.env['NX_MONGO_DB_URL']

@Module({
  imports: [
    HomeModule,
    AccountModule,
    ProfileModule,
    PostModule,
    CommentModule,
    MongooseModule.forRoot(NX_MONGO_DB_URL)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
