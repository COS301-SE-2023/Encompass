import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { ObjectId } from 'mongodb';
import { MovieCluster } from "../../MovieCluster";
import { MovieClusterSchema } from "./movie-cluster.schema";

@Injectable()
export class MovieClusterSchemaFactory implements EntitySchemaFactory<MovieClusterSchema, MovieCluster> {
    create(movieCluster: MovieCluster): MovieClusterSchema {
        return {
            _id: new ObjectId(movieCluster.getId()),
            MovieIds: movieCluster.getMovieIds(),
            MovieCategories: movieCluster.getMovieCategories(),
        };
    }

    createFromSchema(entitySchema: MovieClusterSchema): MovieCluster {
        return new MovieCluster(
            entitySchema._id.toHexString(),
            entitySchema.MovieIds,
            entitySchema.MovieCategories,
        )
    }
}