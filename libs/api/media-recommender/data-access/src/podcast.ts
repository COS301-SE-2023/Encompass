import { AggregateRoot } from "@nestjs/cqrs";

export class Podcast extends AggregateRoot {
    constructor(
        public readonly _id: string,
        public title: string,
        public image: string,
        public description: string,
        public language: string,
        public categories: string,
        public author: string,
        public website: string,
    ) {
        super();
    }

    getId(): string {
        return this._id;
    }

    getTitle(): string {
        return this.title;
    }

    getImage(): string {
        return this.image;
    }

    getDescription(): string {
        return this.description;
    }

    getLanguage(): string {
        return this.language;
    }

    getCategories(): string {
        return this.categories;
    }

    getAuthor(): string {
        return this.author;
    }

    getWebsite(): string {
        return this.website;
    }
}