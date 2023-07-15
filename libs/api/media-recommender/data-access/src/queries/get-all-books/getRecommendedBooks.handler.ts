import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedBooksQuery } from "./getRecommendedBooks.query";
import { BookDtoRepository } from "../../db/book-dto.repository";
import { HttpService } from "@nestjs/axios";

@QueryHandler(GetRecommendedBooksQuery)
export class GetRecommendedBooksHandler implements IQueryHandler<GetRecommendedBooksQuery> {
    constructor(
        private readonly bookDtoRepository: BookDtoRepository,
        private readonly httpService: HttpService,
    ) {}

    async execute( { userId }: GetRecommendedBooksQuery ) {
        console.log('GetRecommendedBooksQuery...');
        //make AI recommendation here
        const url = process.env["BASE_URL"];
        try {
            console.log("WTF!!!!!");
            const allBooks = await this.bookDtoRepository.findSome();
            console.log("WTF-2!!!!!");
            const currentUserProfile = await this.httpService.get(url + "api/profile/get/" + userId).toPromise();
            console.log("WTF-3!!!!!");
            const allProfiles = await this.httpService.get(url + "api/profile/get-all").toPromise();
            console.log("WTF-4!!!!!");
            //const [allBooks, currentUserProfile, allProfiles] = await Promise.all([allBooksPromise, currentUserProfilePromise, allProfilesPromise]);
            console.log("WTF-2!!!!!");
            //const allBooks = await allBooksPromise;
            console.log("WTF-3!!!!!");
            //const currentUserProfile = await currentUserProfilePromise;
            console.log("WTF-4!!!!!");
            //const allProfiles = await allProfilesPromise;

            const userCount = allProfiles?.data?.length;

            //K-means clustering for books where K = sqrt(allBooks.length)
            console.log("K-means clustering for books where K = sqrt(allBooks.length)");
            kmeans(allBooks, Math.sqrt(allBooks.length));
            console.log("K-means clustering after");

            if (userCount <= 3) {
                //
            }

        } catch (error) {
            console.log("WTF-5!!!!!");
            console.log(error);
        }

        function kmeans(data, k) {
            // Initialize centroids randomly
            let centroids = data.slice(0, k);
            //console.log(centroids);
        }


        return await this.bookDtoRepository.findSome();
    }
}