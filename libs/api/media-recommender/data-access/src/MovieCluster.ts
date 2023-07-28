import { AggregateRoot } from "@nestjs/cqrs";

export class MovieCluster extends AggregateRoot{
    constructor(
        public readonly _id: string,
        public MovieIds: string[],
        public MovieCategories: string[],
    ){
        super();
    }

    getId(): string {
        return this._id;
    }

    getMovieIds(): string[] {
        return this.MovieIds;
    }

    getMovieCategories(): string[] {
        return this.MovieCategories;
    }
}