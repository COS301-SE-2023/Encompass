import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SearchController } from "./search.controller";
import { GetPostsByKeywordHandler } from "../../../post/data-access/src/queries/search-posts/get-posts-by-keyword.handler";
import { GetUsersByKeywordHandler } from "../../../profile/data-access/src/queries/search-profiles/get-users-by-keyword.handler";
import { GetCommunitiesByKeywordHandler } from "./queries";
import { ProfileModule } from "@encompass/api/profile/data-access";
import { PostModule } from "@encompass/api/post/data-access";
import { CommunityModule } from "@encompass/api/community/data-access";

@Module({
    imports: [
        CqrsModule,
        ProfileModule,
        PostModule,
        CommunityModule,
        HttpModule
    ],
    controllers: [SearchController],
    providers: [
        GetPostsByKeywordHandler,
        GetUsersByKeywordHandler,
        GetCommunitiesByKeywordHandler
    ],
})

export class SearchModule{}