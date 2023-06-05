import { AggregateRoot } from '@nestjs/cqrs';

export class Community extends AggregateRoot {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly admin: string,
        public readonly about: string,
        public readonly members: string[],
        public readonly events: string[],
        public readonly posts: string[],
    ) {
        super();
    }

    getId() {
        return this._id;
    }

    getName() {
        return this.name;
    }

    getAdmin() {
        return this.admin;
    }

    getAbout() {     
        return this.about;
    }

    getMembers() {
        return [...this.members];
    }

    getEvents() {
        return [...this.events];
    }

    getPosts() {
        return [...this.posts];
    }

}
