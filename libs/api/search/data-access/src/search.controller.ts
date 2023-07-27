import { PostDto } from "@encompass/api/post/data-access";
import { Controller, Get, Param } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetPostsByKeywordQuery } from "./queries/search-posts/get-posts-by-keyword.query";
import { GetUsersByKeywordQuery } from "./queries/search-profiles/get-users-by-keyword.query";
import { ProfileDto } from "@encompass/api/profile/data-access";
import { CommunityDto } from "@encompass/api/community/data-access";
import { GetCommunitiesByKeywordQuery } from "./queries/search-communities/get-communities.query";

@Controller('search')
export class SearchController {
    constructor(
        private readonly queryBus: QueryBus,
    ){}

    @Get('posts-by-keyword/:keyword')
    async getPostsByKeyword(@Param('keyword') keyword: string){
        return await this.queryBus.execute<GetPostsByKeywordQuery, PostDto[]>(
            new GetPostsByKeywordQuery(keyword),
        );
    }

    @Get('users-by-keyword/:keyword')
    async getUsersByKeyword(@Param('keyword') keyword: string){
        return await this.queryBus.execute<GetUsersByKeywordQuery, ProfileDto[]>(
            new GetUsersByKeywordQuery(keyword),
        );
    }

    @Get('communities-by-keyword/:keyword')
    async getCommunitiesByKeyword(@Param('keyword') keyword: string){
        return await this.queryBus.execute<GetCommunitiesByKeywordQuery, CommunityDto[]>(
            new GetCommunitiesByKeywordQuery(keyword),
        );
    }

    @Get('all-by-keyword/:keyword')
    async getAllByKeyword(@Param('keyword') keyword: string){
        const postsPromise = this.queryBus.execute<GetPostsByKeywordQuery, PostDto[]>(
            new GetPostsByKeywordQuery(keyword),
        );
        const usersPromise = this.queryBus.execute<GetUsersByKeywordQuery, ProfileDto[]>(
            new GetUsersByKeywordQuery(keyword),
        );
        const communitiesPromise = this.queryBus.execute<GetCommunitiesByKeywordQuery, CommunityDto[]>(
            new GetCommunitiesByKeywordQuery(keyword),
        );

        const [posts, users, communities] = await Promise.all([postsPromise, usersPromise, communitiesPromise]);
        
        return { posts, users, communities };
    }
}