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
            //K-means clustering for Movies where K = sqrt(allMovies.length)
            const clusters = kmeans(allMovies);
            //get closest cluster to current user profile
            const recommendedCluster = getClusterOfCurrentProfile( clusters, userId );
            console.log("recommendedClusterLength: ");
            console.log(recommendedCluster[0].clusterMovies.length);
            //remove current user profile from cluster
            const recommendedMovies = recommendedCluster[0].clusterMovies.filter(Movie => Movie.MovieId !== userId);
            console.log("recommendedMoviesLength: ");
            console.log(recommendedMovies.length);
            //get recommended Movies from allMovies by _id
            const recommendedMoviesFromAllMovies = allMovies.filter(Movie => recommendedMovies.some(recommendedMovie => recommendedMovie.MovieId === Movie._id));
            //limit to 5 max
            if (recommendedMoviesFromAllMovies.length > 5) {
                recommendedMoviesFromAllMovies.length = 5;
            }

            return recommendedMoviesFromAllMovies;

        } catch (error) {
            return [];
        }

        
    }
}