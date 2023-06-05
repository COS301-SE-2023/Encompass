import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeModule } from '@encompass/api/home/data-access';
import { AccountModule } from '@encompass/api/account/data-access';
import { CommunityModule } from '@encompass/api/community/data-access';

@Module({
  imports: [
    HomeModule,
    AccountModule,
    CommunityModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/encompass-database')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
