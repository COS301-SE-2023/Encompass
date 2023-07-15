import { AggregateRoot } from "@nestjs/cqrs";

export class Book extends AggregateRoot {
    constructor(
        public readonly _id: string,
        public bookId: string,
        public title: string,
        public series: string,
        public author: string,
        public rating: number,
        public description: string,
        public language: string,
        public isbn: string,
        public genres: string,
        public characters: string[],
        public bookFormat: string,
        public edition: string,
        public pages: number,
        public publisher: string,
        public publishDate: string,
        public awards: string[],
        public numRatings: number,
        public ratingsByStars: string[],
        public likedPercent: number,
        public setting: string[],
        public coverImg: string,
        public bbeScore: number,
        public bbeVotes: number,
        public price: number
    ) {
        super();
    }

    getId(): string {
        return this._id;
    }

    getBookId(): string {
        return this.bookId;
    }

    getTitle(): string {
        return this.title;
    }

    getSeries(): string {
        return this.series;
    }

    getAuthor(): string {
        return this.author;
    }

    getRating(): number {
        return this.rating;
    }

    getDescription(): string {
        return this.description;
    }

    getLanguage(): string {
        return this.language;
    }


    getIsbn(): string {
        return this.isbn;
    }

    getGenres(): string {
        return this.genres;
    }

    getCharacters(): string[] {
        return this.characters;
    }

    getBookFormat(): string {
        return this.bookFormat;
    }

    getEdition(): string {
        return this.edition;
    }

    getPages(): number {
        return this.pages;
    }

    getPublisher(): string {
        return this.publisher;
    }

    getPublishDate(): string {
        return this.publishDate;
    }

    getAwards(): string[] {
        return this.awards;
    }

    getNumRatings(): number {
        return this.numRatings;
    }

    getRatingsByStars(): string[] {
        return this.ratingsByStars;
    }

    getLikedPercent(): number {
        return this.likedPercent;
    }

    getSetting(): string[] {
        return this.setting;
    }

    getCoverImg(): string {
        return this.coverImg;
    }

    getBbeScore(): number {
        return this.bbeScore;
    }

    getBbeVotes(): number {
        return this.bbeVotes;
    }

    getPrice(): number {
        return this.price;
    }

}