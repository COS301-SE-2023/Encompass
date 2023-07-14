export class BookDto {
    readonly _id!: string;
    readonly bookId!: string;
    readonly title!: string;
    readonly series!: string;
    readonly author!: string;
    readonly rating!: number;
    readonly description!: string;
    readonly language!: string;
    readonly isbn!: string;
    readonly genres!: string[];
    readonly characters!: string[];
    readonly bookFormat!: string;
    readonly edition!: string;
    readonly pages!: number;
    readonly publisher!: string;
    readonly publishDate!: string;
    readonly awards!: string[];
    readonly numRatings!: number;
    readonly ratingsByStars!: string[];
    readonly likedPercent!: number;
    readonly setting!: string[];
    readonly coverImg!: string;
    readonly bbeScore!: number;
    readonly bbeVotes!: number;
    readonly price!: number;
}