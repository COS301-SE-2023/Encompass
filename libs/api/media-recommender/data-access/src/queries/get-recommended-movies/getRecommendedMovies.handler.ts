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

        function getClusterOfCurrentProfile( clusters: { clusterCentroid: number[], clusterMovies: { Movie: number[], MovieId: string }[] }[], userId: string ) {
            const userCluster = clusters.filter(cluster => cluster.clusterMovies.some(Movie => Movie.MovieId === userId));
            return userCluster;
        }

        function kmeans(items: MovieDto[]) {
            const k = defineK(items.length);
            const MovieArrays = setupMovieArrays(items);
            const tempMovieArrays = Object.values(MovieArrays);
            const clusters: { clusterCentroid: number[], clusterMovies: { Movie: number[], MovieId: string }[] }[] = [];
            //choose k random tempMovieArrays to be cluster centroids
            for (let i = 0; i < k; i++) {
                const randomIndex = Math.floor(Math.random() * tempMovieArrays.length);
                clusters.push({ clusterCentroid: Object.values(tempMovieArrays[randomIndex].Movie) , clusterMovies: [] });
                tempMovieArrays.splice(randomIndex, 1);
            }

            let oldCentroids = clusters.map(cluster => Object.values( cluster.clusterCentroid ));
            let newCentroids = clusters.map(cluster => Object.values( cluster.clusterCentroid ));
            //while centroids are changing
            do{
                oldCentroids = newCentroids;
                //assign each Movie to the closest cluster
                moveToClosestCentroid(MovieArrays, clusters, k);
                //recalculate the cluster centroids
                calculateNewCentroids(clusters);
                newCentroids = clusters.map(cluster => Object.values( cluster.clusterCentroid ));
                console.log("--------recalculate centroids--------");
                //print out the number of Movies in each cluster
                for(let i = 0; i < clusters.length; i++){
                    console.log("cluster " + i + ": " + clusters[i].clusterMovies.length);
                }
            } while ( !arraysAreEqual(oldCentroids, newCentroids) );
            
            return clusters;
        }

        function calculateNewCentroids(clusters: { clusterCentroid: number[], clusterMovies: { Movie: number[], MovieId: string }[] }[]) {
            for(let j = 0; j < clusters.length; j++){
                if(clusters[j].clusterMovies.length == 0){
                    continue;
                }
                for(let l = 0; l < clusters[0].clusterCentroid.length; l++){
                    let sum = 0;
                    for(let k = 0; k < clusters[j].clusterMovies.length; k++){
                        sum += clusters[j].clusterMovies[k].Movie[l];
                    }
                    clusters[j].clusterCentroid[l] = sum / clusters[j].clusterMovies.length; 
                }   
            }
        }

        function arraysAreEqual(array1: number[][], array2: number[][]) {
            if(array1.length != array2.length){
                return false;
            }
            for(let i = 0; i < array1.length; i++){
                if(array1[i].length != array2[i].length){
                    return false;
                }
                for(let j = 0; j < array1[i].length; j++){
                    if(array1[i][j] != array2[i][j]){
                        return false;
                    }
                }
            }
            return true;
        }

        
    }
}