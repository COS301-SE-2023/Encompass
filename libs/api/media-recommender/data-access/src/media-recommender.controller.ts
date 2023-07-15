import { Controller, Get, Param } from "@nestjs/common";
import { BookDto } from "./book.dto";
import { QueryBus } from "@nestjs/cqrs";
import { GetRecommendedBooksQuery } from "./queries/get-all-books/getRecommendedBooks.query";

@Controller('media-recommender')
export class MediaRecommenderController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get('books/:id')
    async getRecommendedBooks(@Param('id') id: string) {
        return this.queryBus.execute<GetRecommendedBooksQuery, BookDto[]>(
            new GetRecommendedBooksQuery(id),
        );
    }
}


