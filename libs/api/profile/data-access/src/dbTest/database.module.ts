import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from "./database.service";
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('NX_ENVIRONMENT') === 'development' 
                ? configService.get<string>('NX_MONGO_DB_URL') 
                : configService.get<string>('NX_MONGO_DB_TEST_URL')
            }),
            inject: [ConfigService]
        }),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}