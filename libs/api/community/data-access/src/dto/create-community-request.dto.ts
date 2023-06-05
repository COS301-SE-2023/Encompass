export class CreateCommunityRequest {
    _id!: string;
    name!: string;
    admin!: string;
    about!: string;
    members!: string[];
    events!: string[];
    posts!: string[];
}