import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllItemsByKeywordQuery } from "./get-all-items-by-keyword.query";
import { HttpService } from "@nestjs/axios";

@QueryHandler(GetAllItemsByKeywordQuery)
export class GetAllItemsByKeywordHandler implements IQueryHandler<GetAllItemsByKeywordQuery> {
    constructor(
        private readonly httpService: HttpService
    ) {}

    async execute({ keyword }: GetAllItemsByKeywordQuery) {
        const url = process.env['BASE_URL'];
        const allPostsPromise = this.httpService.get(`${url}/api/post/get-posts-by-keyword/${keyword}`).toPromise();
        const allCommunitiesPromise = this.httpService.get(`${url}/api/community/get-communities-by-keyword/${keyword}`).toPromise();
        const allProfilesPromise = this.httpService.get(`${url}/api/profile/get-users-by-keyword/${keyword}`).toPromise();

        const [allPosts, allCommunities, allProfiles]  = await Promise.all([allPostsPromise, allCommunitiesPromise, allProfilesPromise]);
        const [allPostsData, allCommunitiesData, allProfilesData] = [allPosts?.data, allCommunities?.data, allProfiles?.data];
        return [...allPostsData, ...allCommunitiesData, ...allProfilesData];
    }
}