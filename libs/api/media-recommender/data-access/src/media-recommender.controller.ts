import { Controller, Get } from "@nestjs/common";
import { BookDto } from "./book.dto";
import { QueryBus } from "@nestjs/cqrs";
import { GetAllBooksQuery } from "./queries/get-all-books/getAllBooks.query";

@Controller('media-recommender')
export class MediaRecommenderController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get('getAllBooks')
    async getAllBooks() {
        return await this.queryBus.execute<GetAllBooksQuery, BookDto[]>{
            new GetAllBooksQuery(),
        }
    }
}


