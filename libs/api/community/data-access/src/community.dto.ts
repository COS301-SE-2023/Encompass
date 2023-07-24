
export class CommunityDto {
    readonly _id!: string;
    readonly name!: string;
    readonly type!: string;
    readonly admin!: string;
    readonly about!: string;
    readonly rules!: string;
    readonly groupImage!: string;
    readonly bannerImage!: string;
    readonly categories!: string[];
    readonly events!: string[];
    readonly posts!: string[];
    readonly members!: string[];
    readonly ageRestricted!: boolean;
    readonly createdAt!: string;
}
