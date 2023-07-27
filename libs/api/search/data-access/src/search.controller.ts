import { PostDto } from "@encompass/api/post/data-access";
import { Controller, Get, Param } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetAllItemsByKeywordQuery } from "./queries/get-all-items-by-keyword.query";

@Controller('search')
export class SearchController {
    constructor(
        private readonly queryBus: QueryBus,
    ){}

    @Get('all-items-by-keyword/:keyword')
    async getAllItemsByKeyword(@Param('keyword') keyword: string){
        return await this.queryBus.execute<GetAllItemsByKeywordQuery, PostDto[]>(
            new GetAllItemsByKeywordQuery(keyword),
        );
    }
}