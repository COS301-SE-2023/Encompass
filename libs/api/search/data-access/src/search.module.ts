import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SearchController } from "./search.controller";
import { GetAllItemsByKeywordHandler } from "./queries";


@Module({
    imports: [
        CqrsModule,
        HttpModule
    ],
    controllers: [SearchController],
    providers: [
        GetAllItemsByKeywordHandler
    ],
})

export class SearchModule{}