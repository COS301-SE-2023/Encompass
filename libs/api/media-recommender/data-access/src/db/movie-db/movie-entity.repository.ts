import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { MovieSchema } from "./movie.schema";
import { Movie } from "../../movie";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { MovieSchemaFactory } from "./movie-schema.factory";
import { MovieDto } from "../../movie.dto";

@Injectable()
export class MovieEntityRepository extends BaseEntityRepository<MovieSchema, Movie>{
    private readonly MovieModel: Model<MovieSchema>;

    constructor(
        @InjectModel(MovieSchema.name)
        MovieModel: Model<MovieSchema>,
        MovieSchemaFactory: MovieSchemaFactory,
    ) {
        super(MovieModel, MovieSchemaFactory);
        this.MovieModel = MovieModel;
    }

    async findSome(): Promise<MovieDto[]> {
        //choose random 200 Movies 
        return await this.MovieModel.aggregate([{ $sample: { size: 200 } }]);
    }
} 