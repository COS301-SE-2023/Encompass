import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedBooksQuery } from "./getRecommendedBooks.query";
import { HttpService } from "@nestjs/axios";
import { BookEntityRepository } from "../../db/book-entity.repository";
import { BookDto } from "../../book.dto";
import { categoryMappings } from '../categoryMappings';

@QueryHandler(GetRecommendedBooksQuery)
export class GetRecommendedBooksHandler implements IQueryHandler<GetRecommendedBooksQuery> {
    constructor(
        private readonly bookEntityRepository: BookEntityRepository,
        private readonly httpService: HttpService,
    ) {}

    async execute( { userId }: GetRecommendedBooksQuery ) {
        console.log('GetRecommendedBooksQuery...');
        //make AI recommendation here
        const url = process.env["BASE_URL"];
        try {
            const allBooksPromise = this.bookEntityRepository.findSome();
            const currentUserProfilePromise = this.httpService.get(url + "/api/profile/get/" + userId).toPromise();
            const [allBooks, currentUserProfile] = await Promise.all([allBooksPromise, currentUserProfilePromise]);

            convertUserCategories( currentUserProfile?.data );

            addUserToBook(allBooks, currentUserProfile?.data);
            //K-means clustering for books where K = sqrt(allBooks.length)
            const clusters = kmeans(allBooks);
            //get closest cluster to current user profile
            const recommendedCluster = getClusterOfCurrentProfile( clusters, userId );
            //remove current user profile from cluster
            const recommendedBooks = recommendedCluster[0].clusterBooks.filter(book => book.bookId !== userId);
            //get recommended books from allBooks by _id
            const recommendedBooksFromAllBooks = allBooks.filter(book => recommendedBooks.some(recommendedBook => recommendedBook.bookId === book._id));
            //limit max to 5 books
            if (recommendedBooksFromAllBooks.length > 2) {
                recommendedBooksFromAllBooks.length = 2;
            }

            return recommendedBooksFromAllBooks;

        } catch (error) {
            console.log(error);
            return [];
        }

        function convertUserCategories( currentUserProfile: any ) {
            const updatedProfile: string[] = [];
            currentUserProfile.categories?.forEach((category: any) => {
                if (categoryMappings[category]) {
                    updatedProfile.push(categoryMappings[category].novels);
                } else {
                    updatedProfile.push(category);
                }
            });
            currentUserProfile.categories = updatedProfile;
        }

        function getClusterOfCurrentProfile( clusters: { clusterCentroid: number[], clusterBooks: { book: number[], bookId: string }[] }[], userId: string ) {
            const userCluster = clusters.filter(cluster => cluster.clusterBooks.some(book => book.bookId === userId));
            return userCluster;
        }

        function addUserToBook(allBooks: BookDto[], currentUserProfile: any) {
            //add user profile as one book
            const tempBook: BookDto = {
                _id: currentUserProfile._id,
                bookId: "",
                title: "",
                series: "",
                author: "",
                rating: 0,
                description: "",
                language: "",
                isbn: "",
                genres: currentUserProfile.communities,
                characters: [],
                bookFormat: "",
                edition: "",
                pages: 0,
                publisher: "",
                publishDate: "",
                awards: [],
                numRatings: 0,
                ratingsByStars: [],
                likedPercent: 0,
                setting: [],
                coverImg: "",
                bbeScore: 0,
                bbeVotes: 0,
                price: 0,
            };
            allBooks.push(tempBook);
        }

        function kmeans(items: BookDto[]) {
            const k = defineK(items.length);
            const bookArrays = setupBookArrays(items);
            const tempBookArrays = Object.values(bookArrays);
            const clusters: { clusterCentroid: number[], clusterBooks: { book: number[], bookId: string }[] }[] = [];
            //choose k random tempBookArrays to be cluster centroids
            for (let i = 0; i < k; i++) {
                const randomIndex = Math.floor(Math.random() * tempBookArrays.length);
                clusters.push({ clusterCentroid: Object.values(tempBookArrays[randomIndex].book) , clusterBooks: [] });
                tempBookArrays.splice(randomIndex, 1);
            }

            let oldCentroids = clusters.map(cluster => Object.values( cluster.clusterCentroid ));
            let newCentroids = clusters.map(cluster => Object.values( cluster.clusterCentroid ));
            //while centroids are changing
            do{
                oldCentroids = newCentroids;
                //assign each book to the closest cluster
                moveToClosestCentroid(bookArrays, clusters, k);
                //recalculate the cluster centroids
                calculateNewCentroids(clusters);
                newCentroids = clusters.map(cluster => Object.values( cluster.clusterCentroid ));
                /*console.log("--------recalculate centroids--------");
                //print out the number of books in each cluster
                for(let i = 0; i < clusters.length; i++){
                    console.log("cluster " + i + ": " + clusters[i].clusterBooks.length);
                }*/
            } while ( !arraysAreEqual(oldCentroids, newCentroids) );
            
            return clusters;
        }

        function defineK(elements: number) {
            //define K as the square root of the number of users
            const k = Math.sqrt(elements);
            return Math.floor(k);
        }

        function calculateNewCentroids(clusters: { clusterCentroid: number[], clusterBooks: { book: number[], bookId: string }[] }[]) {
            for(let j = 0; j < clusters.length; j++){
                if(clusters[j].clusterBooks.length == 0){
                    continue;
                }
                for(let l = 0; l < clusters[0].clusterCentroid.length; l++){
                    let sum = 0;
                    for(let k = 0; k < clusters[j].clusterBooks.length; k++){
                        sum += clusters[j].clusterBooks[k].book[l];
                    }
                    clusters[j].clusterCentroid[l] = sum / clusters[j].clusterBooks.length; 
                }   
            }
        }

        function moveToClosestCentroid(bookArrays: { book: number[], bookId: string }[], clusters: { clusterCentroid: number[], clusterBooks: { book: number[], bookId: string }[] }[], k: number) {
            //if all clusterBooks in clusters are empty, just add book to closest clusterCentroid else move book to new closest clusterCentroid
            const initialClustersEmpty = clusters.every(cluster => cluster.clusterBooks.length == 0);
            for(let i = 0; i < bookArrays.length; i++){
                const distances = [];
                for(let j = 0; j < k; j++){
                    distances.push(getDistance(clusters[j].clusterCentroid, bookArrays[i]));
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
                    clusters[smallestDistanceIndex].clusterBooks.push(bookArrays[i]);
                } else {
                    //find the closest clusterCentroid to the profile
                    //if the profile is already in closest clusterCentroid then do nothing, else move the profile to the new closest clusterCentroid
                    if(clusters[smallestDistanceIndex].clusterBooks.includes(bookArrays[i])){
                        continue;
                    } else {
                        for(let j = 0; j < k; j++){
                            if(clusters[j].clusterBooks.includes(bookArrays[i])) {
                                clusters[j].clusterBooks.splice(clusters[j].clusterBooks.indexOf(bookArrays[i]), 1);
                                clusters[smallestDistanceIndex].clusterBooks.push(bookArrays[i]);
                                break;
                            }
                        }
                    }
                }
            }
        }

        function getDistance(clusterCentroid: number[], book: { book: number[], bookId: string }) {
            let distance = 0;
            for(let i = 0; i < clusterCentroid.length; i++){
                distance += Math.pow(clusterCentroid[i] - book.book[i], 2);
            }
            return Math.sqrt(distance);
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

        function setupBookArrays(items: BookDto[]) {
            const books: { book: number[], bookId: string }[] = [];
            const bookIds: string[] = [];
            const series: string[] = [];
            const author: string[] = [];
            const genres: string[] = [];
            const publisher: string[] = [];

            items?.forEach((item) => {
                bookIds.push(item._id);
                //console.log(item._id);
                loadCategories(series, item.series);
                loadCategories(author, item.author,false,true);
                loadCategories(genres, item.genres, true);
                loadCategories(publisher, item.publisher);
            });

            //push 0 or 1 to each book array in books if it has the category, and then add bookId to the end
            items?.forEach((item) => { //test this!!!!
                const book: { book: number[], bookId: string } = { book: [], bookId: "" };

                genres?.forEach((genresItem) => {
                    if (item.genres?.includes(genresItem)) {
                        book.book.push(1);
                    } else {
                        book.book.push(0);
                    }
                });

                series?.forEach((seriesItem) => {

                    if (item.series?.includes(seriesItem)) {
                        book.book.push(1);
                    } else {
                        book.book.push(0);
                    }
                });

                author?.forEach((authorItem) => {
                    if (item.author?.includes(authorItem)) {
                        book.book.push(1);
                    } else {
                        book.book.push(0);
                    }
                });

                publisher?.forEach((publisherItem) => {
                    if (item.publisher?.includes(publisherItem)) {
                        book.book.push(1);
                    } else {
                        book.book.push(0);
                    }
                });

                book.bookId = item._id;
                books.push(book);
            });

            return books;

        }

        function loadCategories( categories: string[], category: string, categoryIsArray = false, categyIsAuthor = false ) {
            /*console.log("typeof category: " + typeof category);
            console.log("category after type:");
            console.log(category);*/
            if ( categoryIsArray && typeof category === "string" ) {
                const parsableArray = category?.replace(/'/g, '"');
                const array = JSON.parse(parsableArray);
                if ( array.length < 1 ) {
                    return;
                }
                
                array?.forEach((item: string) => {
                    if ( categories.length < 1 || !categories.includes(item) ) {
                        categories.push(item);
                    }
                });

                return;
            }
            if ( (categories.length < 1 || !categories.includes(category)) && typeof category === "string" ) {
                if ( categyIsAuthor ) {
                    //get characters before first comma
                    const author = category.split(",")[0];
                    categories.push(author);
                    return;
                }
                categories.push(category);
            }
        }
    }
}