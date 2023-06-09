export class CreateCommunityRequest {
    _id!: string;
    name!: string;
    admin!: string;
    about!: string;
    events!: string[];
    posts!: string[];
    members!: string[];
}