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

        

        return await this.bookEntityRepository.findSome();
    }
}