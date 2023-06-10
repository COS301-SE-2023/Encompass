export class UpdateCommunityRequest {
    name!: string;
    admin!: string;
    about!: string;
    events!: string[];
    posts!: string[];
    members!: string[];
}