import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { MovieClusterSchema } from "./movie-cluster.schema";
import { MovieCluster } from "../../MovieCluster";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { MovieClusterDto } from "../../movie-cluster.dto";
import { MovieClusterSchemaFactory } from "./movie-cluster-schema.factory";

@Injectable()
export class MovieClusterEntityRepository extends BaseEntityRepository<MovieClusterSchema, MovieCluster>{
    private readonly MovieClusterModel: Model<MovieClusterSchema>;

    constructor(
        @InjectModel(MovieClusterSchema.name)
        MovieClusterModel: Model<MovieClusterSchema>,
        MovieClusterSchemaFactory: MovieClusterSchemaFactory,
    ) {
        super(MovieClusterModel, MovieClusterSchemaFactory);
        this.MovieClusterModel = MovieClusterModel;
    }

    /*async findSome(): Promise<MovieClusterDto[]> {
        //choose random 200 MovieClusters 
        return await this.MovieClusterModel.aggregate([{ $sample: { size: 200 } }]);
    }*/
}