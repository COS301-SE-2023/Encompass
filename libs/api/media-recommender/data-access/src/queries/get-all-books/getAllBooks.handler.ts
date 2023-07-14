import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllBooksQuery } from "./getAllBooks.query";
import { BookDtoRepository } from "../../db/book-dto.repository";

@QueryHandler(GetAllBooksQuery)
export class GetAllBooksHandler implements IQueryHandler<GetAllBooksQuery> {
    constructor(private readonly bookDtoRepository: BookDtoRepository) {}

    async execute() {
        return await this.bookDtoRepository.findAll();
    }
}