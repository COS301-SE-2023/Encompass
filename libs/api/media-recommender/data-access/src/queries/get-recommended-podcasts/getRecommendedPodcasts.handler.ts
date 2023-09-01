import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedPodcastsQuery } from "./getRecommendedPodcasts.query";

@QueryHandler(GetRecommendedPodcastsQuery)
export class GetRecommendedPodcastsHandler implements IQueryHandler<GetRecommendedPodcastsQuery> {
    constructor(
        private readonly getRecommendedPodcastsQuery: GetRecommendedPodcastsQuery,
        
    ) {}


}