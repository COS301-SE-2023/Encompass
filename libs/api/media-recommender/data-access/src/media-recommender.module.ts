import { CqrsModule } from "@nestjs/cqrs";
import { BookSchema } from "./db/book.schema";
import { MongooseModule, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Get, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { MediaRecommenderController } from "./media-recommender.controller";
import { BookEntityRepository } from "./db/book-entity.repository";
import { BookDtoRepository } from "./db/book-dto.repository";
import { BookSchemaFactory } from "./db/book-schema.factory";
import { Book } from "./book";
import { GetAllBooksHandler } from "./queries/get-all-books/getAllBooks.handler";

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

    controllers: [MediaRecommenderController],
    providers: [
        BookEntityRepository,
        BookDtoRepository,
        BookSchemaFactory,
        BookSchema,
        GetAllBooksHandler,
    ],
})

export class MediaRecommenderModule {}