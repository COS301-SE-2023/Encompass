import { Controller, Get, Param } from "@nestjs/common";
import { BookDto } from "./book.dto";
import { QueryBus } from "@nestjs/cqrs";
import { GetRecommendedBooksQuery } from "./queries/get-all-books/getRecommendedBooks.query";
import { GetRecommendedMoviesQuery } from "./queries/get-recommended-movies/getRecommendedMovies.query";
import { MovieDto } from "./movie.dto";

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

}


