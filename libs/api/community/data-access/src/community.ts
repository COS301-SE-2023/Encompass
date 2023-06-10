import { AggregateRoot } from "@nestjs/cqrs";
import { UpdateCommunityCommand } from "./commands/update-community.command";

export class Community extends AggregateRoot{
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly admin: string,
        public readonly about: string,
        public readonly events: string[],
        public readonly posts: string[],
        public readonly members: string[],
    ) {
        super();
    }

    getId(): string {
        return this._id;
    }

    getName(): string {
        return this.name;
    }

    getAdmin(): string {
        return this.admin;
    }

    getAbout(): string {
        return this.about;
    }

    getEvents(): string[] {
        return this.events;
    }

    getPosts(): string[] {
        return this.posts;
    }

    getMembers(): string[] {
        return this.members;
    }

    updateCommunity(updateCommunityRequest: UpdateCommunityRequest){
        this.name = updateCommunityRequest.name;
        this.admin = updateCommunityRequest.admin;
        this.about = updateCommunityRequest.about;
        this.events = updateCommunityRequest.events;
        this.posts = updateCommunityRequest.posts;
        this.members = updateCommunityRequest.members;
    }
}