import { ObjectId } from 'mongoose'

export class CommunityDto {
    readonly _id!: string | ObjectId | null | undefined;
    readonly name!: string;
    readonly admin!: string;
    readonly about!: string;
    readonly members!: string[];
    readonly events!: string[];
    readonly posts!: string[];
} 