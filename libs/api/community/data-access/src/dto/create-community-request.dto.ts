export class CreateCommunityRequest {
    name!: string;
    type!: string;
    admin!: string;
    about!: string;
    rules!: string;
    groupImage!: string;
    bannerImage!: string;
    categories!: string[];
    events!: string[];
    posts!: string[];
    members!: string[];
    ageRestricted!: boolean;
    communityEP!: number;
}