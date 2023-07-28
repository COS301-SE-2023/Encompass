import { Get } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllMoviesQuery } from "./getAllMovies.query";
import { MovieEntityRepository } from "../../db/movie-db/movie-entity.repository";

@QueryHandler(GetAllMoviesQuery)
export class GetAllMoviesHandler implements IQueryHandler<GetAllMoviesQuery> {
    constructor(
        private readonly movieEntityRepository: MovieEntityRepository,
    ) {}

    async execute() {
        return await this.movieEntityRepository.findAll();
    }
}