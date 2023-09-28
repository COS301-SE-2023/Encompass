import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedMoviesQuery } from "./getRecommendedMovies.query";
import { MovieDtoRepository } from "../../db/movie-db/movie-dto.repository";
import { HttpService } from "@nestjs/axios";
import { MovieDto } from "../../movie.dto";
import { categoryMappings } from '../categoryMappings';

@QueryHandler(GetRecommendedMoviesQuery)
export class GetRecommendedMoviesHandler implements IQueryHandler<GetRecommendedMoviesQuery> {
    constructor(
        private readonly movieDtoRepository: MovieDtoRepository,
        private readonly httpService: HttpService,
    ){}

    async execute( { userId }: GetRecommendedMoviesQuery ) {
        const url = process.env["BASE_URL"];

        try {
            const currentUserProfilePromise = this.httpService.get(url + "/api/profile/get/" + userId).toPromise();
            const recommendedUsersPromise = this.httpService.get(url + "/api/profile/get-recommended/" + userId).toPromise();
            const [currentUserProfile, recommendedUsers] = await Promise.all([currentUserProfilePromise, recommendedUsersPromise]);
            
            
            if (recommendedUsers?.data.length < 1) {
                
                const categories = convertUserCategories(currentUserProfile?.data);
                const allMovies = await this.movieDtoRepository.findSome(categories);
                addUserToMovie(allMovies, currentUserProfile?.data);
                //K-means clustering for Movies where K = sqrt(allMovies.length)
                const clusters = kmeans(allMovies);
                //get closest cluster to current user profile
                const recommendedCluster = getClusterOfCurrentProfile( clusters, userId );
                //remove current user profile from cluster
                const recommendedMovies = recommendedCluster[0].clusterMovies.filter(Movie => Movie.MovieId !== userId);
                //get recommended Movies from allMovies by _id
                const recommendedMoviesFromAllMovies = allMovies.filter(Movie => recommendedMovies.some(recommendedMovie => recommendedMovie.MovieId === Movie._id));
                //limit to 5 max
                if (recommendedMoviesFromAllMovies.length > 2) {
                    recommendedMoviesFromAllMovies.length = 2;
                }

                return recommendedMoviesFromAllMovies;
            } else {
                const randomIndex = Math.floor(Math.random() * recommendedUsers?.data.length);
                const categories = convertUserCategories(recommendedUsers?.data[randomIndex]);

                const allMovies = await this.movieDtoRepository.findSome(categories);
                addUserToMovie(allMovies, recommendedUsers?.data[randomIndex]);
                const otherUserId = recommendedUsers?.data[randomIndex]._id;

                //K-means clustering for Movies where K = sqrt(allMovies.length)
                const clusters = kmeans(allMovies);
                //get closest cluster to current user profile
                const recommendedCluster = getClusterOfCurrentProfile( clusters, otherUserId );
                //remove current user profile from cluster
                const recommendedMovies = recommendedCluster[0].clusterMovies.filter(Movie => Movie.MovieId !== otherUserId);
                //get recommended Movies from allMovies by _id
                const recommendedMoviesFromAllMovies = allMovies.filter(Movie => recommendedMovies.some(recommendedMovie => recommendedMovie.MovieId === Movie._id));
                //limit to 5 max
                if (recommendedMoviesFromAllMovies.length > 2) {
                    recommendedMoviesFromAllMovies.length = 2;
                }

                return recommendedMoviesFromAllMovies;
            }
        } catch (error) {
            return [];
        }

        function convertUserCategories( currentUserProfile: any ) {
            const updatedProfile: string[] = [];
            currentUserProfile.categories.forEach((category: any) => {
                if (categoryMappings[category.category]) {
                    updatedProfile.push(...categoryMappings[category.category].movies);
                } else {
                    updatedProfile.push(category.category);
                }
            });
            currentUserProfile.categories = updatedProfile;
            return updatedProfile;
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
                //console.log("--------recalculate centroids--------");
                //print out the number of Movies in each cluster
                /*for(let i = 0; i < clusters.length; i++){
                    console.log("cluster " + i + ": " + clusters[i].clusterMovies.length);
                }*/
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

        function moveToClosestCentroid(MovieArrays: { Movie: number[], MovieId: string }[], clusters: { clusterCentroid: number[], clusterMovies: { Movie: number[], MovieId: string }[] }[], k: number) {
            //if all clusterMovies in clusters are empty, just add Movie to closest clusterCentroid else move Movie to new closest clusterCentroid
            const initialClustersEmpty = clusters.every(cluster => cluster.clusterMovies.length == 0);
            for(let i = 0; i < MovieArrays.length; i++){
                const distances = [];
                for(let j = 0; j < k; j++){
                    distances.push(getDistance(clusters[j].clusterCentroid, MovieArrays[i]));
                }
                //get the index of the smallest distance and insert profile into that cluster
                let smallestDistance = distances[0];
                let smallestDistanceIndex = 0;
                for(let j = 0; j < distances.length; j++){
                    if(distances[j] < smallestDistance){
                        smallestDistance = distances[j];
                        smallestDistanceIndex = j;
                    }
                }

                //test this!!!
                if(initialClustersEmpty){
                    clusters[smallestDistanceIndex].clusterMovies.push(MovieArrays[i]);
                } else {
                    //find the closest clusterCentroid to the profile
                    //if the profile is already in closest clusterCentroid then do nothing, else move the profile to the new closest clusterCentroid
                    if(clusters[smallestDistanceIndex].clusterMovies.includes(MovieArrays[i])){
                        continue;
                    } else {
                        for(let j = 0; j < k; j++){
                            if(clusters[j].clusterMovies.includes(MovieArrays[i])) {
                                clusters[j].clusterMovies.splice(clusters[j].clusterMovies.indexOf(MovieArrays[i]), 1);
                                clusters[smallestDistanceIndex].clusterMovies.push(MovieArrays[i]);
                                break;
                            }
                        }
                    }
                }
            }
        }

        function getDistance(clusterCentroid: number[], Movie: { Movie: number[], MovieId: string }) {
            let distance = 0;
            for(let i = 0; i < clusterCentroid.length; i++){
                distance += Math.pow(clusterCentroid[i] - Movie.Movie[i], 2);
            }
            return Math.sqrt(distance);
        }

        function defineK(elements: number) {
            //define K as the square root of the number of users
            const k = Math.sqrt(elements);
            return Math.floor(k);
        }

        function setupMovieArrays(items: MovieDto[]) {
            const Movies: { Movie: number[], MovieId: string }[] = [];
            const MovieIds: string[] = [];
            const genres: string[] = [];

            items.forEach((item) => {   //test this!!!!
                MovieIds.push(item._id);
                //console.log(item._id);
                //add Genres to genres array, first split the string into an array on ","
                const genresArray = item.Genre?.split(",");
                //remove any whitespace from each genre
                genresArray?.forEach((genre, index) => {
                    genresArray[index] = genre.trim();
                });
                //then add each genre to the genres array if it doesn't already exist
                genresArray?.forEach((genre) => {
                    if (!genres.includes(genre)) {
                        genres.push(genre);
                    }
                });
            });

            //push 0 or 1 to each Movie array in Movies if it has the category, and then add MovieId to the end
            items.forEach((item) => { //test this!!!!
                const Movie: { Movie: number[], MovieId: string } = { Movie: [], MovieId: "" };

                genres?.forEach((genresItem) => {
                    if (item.Genre?.includes(genresItem)) {
                        Movie.Movie.push(1);
                    } else {
                        Movie.Movie.push(0);
                    }
                });

                Movie.MovieId = item._id;
                Movies.push(Movie);
            });

            return Movies;

        }

        function addUserToMovie(allMovies: MovieDto[], currentUserProfile: any) {
            //add user profile as one Movie 
            const tempMovie: MovieDto = {
                _id: currentUserProfile._id,
                Release_Date: "", // Assuming the original value is a string in ISO 8601 format
                Title: currentUserProfile.name,
                Overview: "",
                Popularity: 0,
                Vote_Count: 0,
                Vote_Average: 0,
                Original_Language: "en",
                Genre: currentUserProfile.categories.join(","),
                Poster_Url: "",
            };

            allMovies.push(tempMovie);
        }
    }
}