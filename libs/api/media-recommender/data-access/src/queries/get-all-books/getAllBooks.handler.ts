import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllBooksQuery } from "./getAllBooks.query";
import { BookDtoRepository } from "../../db/book-dto.repository";

@QueryHandler(GetAllBooksQuery)
export class GetAllBooksHandler implements IQueryHandler<GetAllBooksQuery> {
    constructor(private readonly bookDtoRepository: BookDtoRepository) {}

    async execute() {
        console.log('GetAllBooksQuery...');
        //make AI recommendation here
         


        return await this.bookDtoRepository.findSome();
    }
}