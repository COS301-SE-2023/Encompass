import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MovieClusterSchema } from "./movie-cluster.schema";
import { Model } from "mongoose";

@Injectable()
export class MovieClusterDtoRepository{
    constructor(
        @InjectModel(MovieClusterSchema.name)
        private readonly movieClusterModel: Model<MovieClusterSchema>,
    ) {}

    async findAll(): Promise<MovieClusterSchema[]> {
        return await this.movieClusterModel.find();
    }

}