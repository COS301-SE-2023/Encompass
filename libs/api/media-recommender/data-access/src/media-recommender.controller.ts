import { Controller, Get, Param } from "@nestjs/common";
import { BookDto } from "./book.dto";
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { GetRecommendedBooksQuery } from "./queries/get-all-books/getRecommendedBooks.query";
import { GetRecommendedMoviesQuery } from "./queries/get-recommended-movies/getRecommendedMovies.query";
import { MovieDto } from "./movie.dto";
import { GetAllMoviesQuery } from "./queries/get-all-movies/getAllMovies.query";

@Controller('media-recommender')
export class MediaRecommenderController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}

    @Get('books/:id')
    async getRecommendedBooks(@Param('id') id: string) {
        return this.queryBus.execute<GetRecommendedBooksQuery, BookDto[]>(
            new GetRecommendedBooksQuery(id),
        );
    }

    @Get('movies/:id')
    async getRecommendedMovies(@Param('id') id: string) {
        return this.queryBus.execute<GetRecommendedMoviesQuery, MovieDto[]>(
            new GetRecommendedMoviesQuery(id),
        );
    }

    @Get('all-movies')
    async getAllMovies() {
        return this.queryBus.execute<GetAllMoviesQuery, MovieDto[]>(
            new GetAllMoviesQuery(),
        );
    }

    @Get('podcasts/:id')
    async getRecommendedPodcasts(@Param('id') id: string) {
        return this.queryBus.execute<GetRecommendedPodcastsQuery, PodcastDto[]>(
            new GetRecommendedPodcastsQuery(id),
        );
    }

}


