@Controller('media-recommender')
export class MediaRecommenderController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get('getAllBooks')
    async getAllBooks() {
        return await this.queryBus.execute<GetAllBooksQuery, BookDto[]>{
            new GetAllBooksQuery(),
        }
    }
}


