import { CqrsModule } from "@nestjs/cqrs";
import { BookSchema } from "./db/book.schema";
import { MongooseModule, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [
        CqrsModule,
        MongooseModule.forFeature([
            { 
                name: BookSchema.name, 
                schema: SchemaFactory.createForClass(BookSchema),
            },
        ]),
        HttpModule
    ],

    controllers: [],
    providers: [],
})

export class MediaRecommenderModule {}