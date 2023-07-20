import { Get } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedMoviesQuery } from "./getRecommendedMovies.query";
import { MovieDtoRepository } from "../../db/movie-db/movie-dto.repository";
import { HttpService } from "@nestjs/axios";
import { MovieDto } from "../../movie.dto";
import { MovieSchema } from "../../db/movie-db/movie.schema";

@QueryHandler(GetRecommendedMoviesQuery)
export class GetRecommendedMoviesHandler implements IQueryHandler<GetRecommendedMoviesQuery> {
    constructor(
        private readonly movieDtoRepository: MovieDtoRepository,
        private readonly httpService: HttpService,
    ){}

    async execute( { userId }: GetRecommendedMoviesQuery ) {
        const url = process.env["BASE_URL"];

        try {
            const allMoviesPromise = this.movieDtoRepository.findSome();
            const currentUserProfilePromise = this.httpService.get(url + "/api/profile/get/" + userId).toPromise();
            const [allMovies, currentUserProfile] = await Promise.all([allMoviesPromise, currentUserProfilePromise]);
            
            addUserToMovie(allMovies, currentUserProfile?.data);

            return allMovies;
        } catch (error) {
            return [];
        }

        function addUserToMovie(allMovies: MovieSchema[], currentUserProfile: any) {
            //add user profile as one Movie
            const tempMovie: MovieSchema = {
                _id: currentUserProfile._id,
                Release_Date: "", // Assuming the original value is a string in ISO 8601 format
                Title: currentUserProfile.name,
                Overview: "",
                Popularity: 0,
                Vote_Count: 0,
                Vote_Average: 0,
                Original_Language: "en",
                Genre: currentUserProfile.categories,
                Poster_Url: "",
            };

            allMovies.push(tempMovie);
        }
    }
}