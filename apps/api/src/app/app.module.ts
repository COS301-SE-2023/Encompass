import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeModule, DatabaseModule } from '@encompass/api/home/data-access';

@Module({
  imports: [HomeModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
