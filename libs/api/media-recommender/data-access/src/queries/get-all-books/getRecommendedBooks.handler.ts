import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedBooksQuery } from "./getRecommendedBooks.query";
import { BookDtoRepository } from "../../db/book-dto.repository";
import { HttpService } from "@nestjs/axios";
import { BookSchema } from "../../db/book.schema";
import { BookEntityRepository } from "../../db/book-entity.repository";
import { BookDto } from "../../book.dto";

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
            const currentUserProfilePromise = this.httpService.get(url + "api/profile/get/" + userId).toPromise();
            const allbookArraysPromise = this.httpService.get(url + "api/profile/get-all").toPromise();
            const [allBooks, currentUserProfile, allbookArrays] = await Promise.all([allBooksPromise, currentUserProfilePromise, allbookArraysPromise]);

            const userCount = allbookArrays?.data?.length;

            //K-means clustering for books where K = sqrt(allBooks.length)
            console.log("K-means clustering for books where K = sqrt(allBooks.length)");
            kmeans(allBooks);
            console.log("K-means clustering after");

            if (userCount <= 3) {
                //
            }

        } catch (error) {
            console.log("WTF-5!!!!!");
            console.log(error);
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
                //assign each book to the closest cluster
                oldCentroids = newCentroids;
                moveToClosestCentroid(bookArrays, clusters, k);
                //recalculate the cluster centroids
                calculateNewCentroids(clusters);
                newCentroids = clusters.map(cluster => Object.values( cluster.clusterCentroid ));
                console.log("--------recalculate centroids--------");
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

            items.forEach((item) => {
                bookIds.push(item._id);
                //console.log(item._id);
                loadCategories(series, item.series);
                loadCategories(author, item.author,false,true);
                loadCategories(genres, item.genres, true);
                loadCategories(publisher, item.publisher);
            });

            //push 0 or 1 to each book array in books if it has the category, and then add bookId to the end
            items.forEach((item) => { //test this!!!!
                const book: { book: number[], bookId: string } = { book: [], bookId: "" };

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

                genres?.forEach((genresItem) => {
                    if (item.genres?.includes(genresItem)) {
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

            /*for (let i = 0; i < 5; i++) {
                console.log("------------------");
                console.log(books[i]);
                console.log("------------------");
            }*/

            return books;

        }

        

        return await this.bookEntityRepository.findSome();
    }
}