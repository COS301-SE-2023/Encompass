import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAllBooksQuery)
export class GetAllBooksHandler implements IQueryHandler<GetAllBooksQuery> {
    constructor(private readonly 