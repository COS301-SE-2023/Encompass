import { CqrsModule } from "@nestjs/cqrs";
import { BookSchema } from "./db/book.schema";
import { MongooseModule, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Get, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { MediaRecommenderController } from "./media-recommender.controller";
import { BookEntityRepository } from "./db/book-entity.repository";
import { BookDtoRepository } from "./db/book-dto.repository";
import { BookSchemaFactory } from "./db/book-schema.factory";
import { GetRecommendedBooksHandler } from "./queries";
import { GetRecommendedMoviesHandler } from "./queries";
import { MovieSchema } from "./db/movie-db/movie.schema";
import { MovieSchemaFactory } from "./db/movie-db/movie-schema.factory";
import { MovieDtoRepository } from "./db/movie-db/movie-dto.repository";
import { MovieEntityRepository } from "./db/movie-db/movie-entity.repository";
import { GetAllMoviesHandler } from "./queries/get-all-movies/getAllMovies.handler";

@Module({
    imports: [
        CqrsModule,
        MongooseModule.forFeature([
            { 
                name: BookSchema.name, 
                schema: SchemaFactory.createForClass(BookSchema),
            },
            {
                name: MovieSchema.name,
                schema: SchemaFactory.createForClass(MovieSchema),
            }
        ]),
        HttpModule
    ],

    controllers: [MediaRecommenderController],
    providers: [
        BookEntityRepository,
        BookDtoRepository,
        BookSchemaFactory,
        BookSchema,
        GetRecommendedBooksHandler,
        MovieSchema,
        MovieSchemaFactory,
        MovieDtoRepository,
        MovieEntityRepository,
        GetRecommendedMoviesHandler,
        GetAllMoviesHandler,
    ],
})

export class MediaRecommenderModule {}