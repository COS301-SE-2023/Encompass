import { EntitySchemaFactory } from '@encompass/api/database/data-access';
import { Injectable } from '@nestjs/common';
import { MovieSchema } from './movie.schema';
import { Movie } from '../../movie';
import { ObjectId } from 'mongodb';

@Injectable()
export class MovieSchemaFactory implements EntitySchemaFactory<MovieSchema, Movie> {
    create(movie: Movie): MovieSchema {
        return {
            _id: new ObjectId(movie.getId()),
            Release_Date: movie.getReleaseDate(),
            Title: movie.getTitle(),
            Overview: movie.getOverview(),
            Popularity: movie.getPopularity(),
            Vote_Count: movie.getVoteCount(),
            Vote_Average: movie.getVoteAverage(),
            Original_Language: movie.getOriginalLanguage(),
            Genre: movie.getGenre(),
            Poster_Url: movie.getPosterUrl(),
        };
    }

    createFromSchema(entitySchema: MovieSchema): Movie {
        return new Movie(
            entitySchema._id.toHexString(),
            entitySchema.Release_Date,
            entitySchema.Title,
            entitySchema.Overview,
            entitySchema.Popularity,
            entitySchema.Vote_Count,
            entitySchema.Vote_Average,
            entitySchema.Original_Language,
            entitySchema.Genre,
            entitySchema.Poster_Url,
        )
    }
}
