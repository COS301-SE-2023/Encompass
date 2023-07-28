import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { CreateMovieClustersCommand } from "./create-movie-clusters.command";
import { MovieDtoRepository } from "../../db/movie-db/movie-dto.repository";
import { MovieClusterEntityRepository } from "../../db/movies-clusters-db/movie-cluster-entity.repository";
import { HttpService } from "@nestjs/axios";

@CommandHandler(CreateMovieClustersCommand)
export class CreateMovieClustersHandler implements ICommandHandler<CreateMovieClustersCommand> {    
    constructor(
        private readonly movieClusterEntityRepository: MovieClusterEntityRepository,
        private readonly httpService: HttpService,
    ) {}

    async execute(): Promise<boolean> {
        const movies = 

        return true;
    }
}