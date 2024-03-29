import { AggregateRoot } from "@nestjs/cqrs";
import { UpdateCommunityCommand } from "./commands/update-community/update-community.command";
import { UpdateCommunityRequest } from "./dto/update-community-request.dto";

export class Community extends AggregateRoot{
    constructor(
        public _id: string,
        public name: string,
        public type: string,
        public admin: string,
        public about: string,
        public rules: string,
        public groupImage: string,
        public bannerImage: string,
        public categories: string[],
        public events: string[],
        public posts: string[],
        public members: string[],
        public ageRestricted: boolean,
        public createdAt: string,
        public communityEP: number
    ) {
        super();
    }

    getId(): string {
        return this._id;
    }

    getName(): string {
        return this.name;
    }

    getType(): string {
        return this.type;
    }

    getAdmin(): string {
        return this.admin;
    }

    getAbout(): string {
        return this.about;
    }

    getRules(): string {
        return this.rules;
    }

    getGroupImage(): string {
        return this.groupImage;
    }

    getBannerImage(): string {
        return this.bannerImage;
    }

    getCategories(): string[] {
        return this.categories;
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

    getAgeRestricted(): boolean {
        return this.ageRestricted;
    }

    getCreatedAt(): string {
        return this.createdAt;
    }

    getCommunityEP(): number {
        return this.communityEP;
    }

    updateCommunity(updateCommunityRequest: UpdateCommunityRequest){
        this.name = updateCommunityRequest.name;
        this.type = updateCommunityRequest.type;
        this.admin = updateCommunityRequest.admin;
        this.about = updateCommunityRequest.about;
        this.rules = updateCommunityRequest.rules;
        this.groupImage = updateCommunityRequest.groupImage;
        this.bannerImage = updateCommunityRequest.bannerImage;
        this.categories = updateCommunityRequest.categories;
        this.events = updateCommunityRequest.events;
        this.posts = updateCommunityRequest.posts;
        this.members = updateCommunityRequest.members;
        this.ageRestricted = updateCommunityRequest.ageRestricted;
        this.communityEP = updateCommunityRequest.communityEP;
    }

    addPost(postName: string){
        const arr = [...this.posts, postName]
        this.posts = arr;
    }

    removePost(postName: string){
        const arr = this.posts.filter(post => post !== postName);
        this.posts = arr;
    }

    removeUser(username: string){
        const arr = this.members.filter(member => member !== username);
        this.members = arr;
    }

    addCoins(amount: number){
        this.communityEP = Number(this.communityEP) + Number(amount);
    }

    removeCoins(amount: number){
        this.communityEP = Number(this.communityEP) - Number(amount);

        if(this.communityEP < 0){
            this.communityEP = 0;
        }
    }

    addEvent(eventId: string){
        if(this.events){
            const arr = [...this.events, eventId];
            this.events = arr;
        }

        else{
            this.events = [eventId];
        }
    }
}