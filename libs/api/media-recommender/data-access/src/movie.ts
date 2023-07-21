import { AggregateRoot } from "@nestjs/cqrs";

export class Movie extends AggregateRoot{
    constructor(
        public readonly _id: string,
        public Release_Date: string, // Assuming the original value is a string in ISO 8601 format
        public Title: string,
        public Overview: string,
        public Popularity: number,
        public Vote_Count: number,
        public Vote_Average: number,
        public Original_Language: string,
        public Genre: string,
        public Poster_Url: string
    ){
        super();
    }

    getId(): string {
        return this._id;
    }

    getReleaseDate(): string {
        return this.Release_Date;
    }

    getTitle(): string {
        return this.Title;
    }

    getOverview(): string {
        return this.Overview;
    }

    getPopularity(): number {
        return this.Popularity;
    }

    getVoteCount(): number {
        return this.Vote_Count;
    }

    getVoteAverage(): number {
        return this.Vote_Average;
    }

    getOriginalLanguage(): string {
        return this.Original_Language;
    }

    getGenre(): string {
        return this.Genre;
    }

    getPosterUrl(): string {
        return this.Poster_Url;
    }
}