import { AggregateRoot } from "@nestjs/cqrs";
import { UpdateCommunityCommand } from "./commands/update-community/update-community.command";
import { UpdateCommunityRequest } from "./dto/update-community-request.dto";

export class Community extends AggregateRoot{
    constructor(
        public _id: string,
        public name: string,
        public admin: string,
        public about: string,
        public events: string[],
        public posts: string[],
        public members: string[],
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