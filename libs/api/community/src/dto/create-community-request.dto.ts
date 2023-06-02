export class CreateCommunityRequest {
    name!: string;
    admin!: string;
    about!: string;
    members!: string[];
    events!: string[];
    posts!: string[];
}