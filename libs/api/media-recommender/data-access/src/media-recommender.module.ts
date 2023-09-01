import { CqrsModule } from "@nestjs/cqrs";
import { BookSchema } from "./db/book.schema";
import { MongooseModule, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Get, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { MediaRecommenderController } from "./media-recommender.controller";
import { BookEntityRepository } from "./db/book-entity.repository";
import { BookDtoRepository } from "./db/book-dto.repository";
import { BookSchemaFactory } from "./db/book-schema.factory";
import { GetRecommendedBooksHandler, GetRecommendedPodcastsHandler } from "./queries";
import { GetRecommendedMoviesHandler } from "./queries";
import { MovieSchema } from "./db/movie-db/movie.schema";
import { MovieSchemaFactory } from "./db/movie-db/movie-schema.factory";
import { MovieDtoRepository } from "./db/movie-db/movie-dto.repository";
import { MovieEntityRepository } from "./db/movie-db/movie-entity.repository";
import { GetAllMoviesHandler } from "./queries/get-all-movies/getAllMovies.handler";
import { PodcastSchema } from "./db/podcast-db/podcast-schema";
import { PodcastEntityRepository } from "./db/podcast-db/podcast-entity.repository";
import { PodcastDto } from "./podcast.dto";
import { PodcastDtoRepository } from "./db/podcast-db/podcast-dto.repository";

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
            },
            {
                name: PodcastSchema.name,
                schema: SchemaFactory.createForClass(PodcastSchema),
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
        GetRecommendedBooksHandler,
        MovieSchema,
        MovieSchemaFactory,
        MovieDtoRepository,
        MovieEntityRepository,
        GetRecommendedMoviesHandler,
        GetAllMoviesHandler,
        PodcastEntityRepository,
        PodcastDtoRepository,
        PodcastSchema,
        GetRecommendedPodcastsHandler,
    ],
})

export class MediaRecommenderModule {}