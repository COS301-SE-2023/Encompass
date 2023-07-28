import { Controller, Get, Param } from "@nestjs/common";
import { BookDto } from "./book.dto";
import { QueryBus } from "@nestjs/cqrs";
import { GetRecommendedBooksQuery } from "./queries/get-all-books/getRecommendedBooks.query";
import { GetRecommendedMoviesQuery } from "./queries/get-recommended-movies/getRecommendedMovies.query";
import { MovieDto } from "./movie.dto";
import { CreateMovieClustersCommand } from "./commands/create-movie-clusters/create-movie-clusters.command";
import { GetAllMoviesQuery } from "./queries/get-all-movies/getAllMovies.query";

@Controller('media-recommender')
export class MediaRecommenderController {
    constructor(private readonly queryBus: QueryBus) {}

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

    @Get('movies-clustering')
    async createMovieClusters() {
        return this.queryBus.execute<CreateMovieClustersCommand, boolean>(
            new CreateMovieClustersCommand(),
        );
    }

}


