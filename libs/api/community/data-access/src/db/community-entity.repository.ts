import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { Community } from "../community";
import { CommunitySchema } from "./community.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommunitySchemaFactory } from "./community-schema.factory";
import { CommunityDto } from "../community.dto";

@Injectable()
export class CommunityEntityRepository extends BaseEntityRepository<
    CommunitySchema,
    Community
> {
    constructor(
        @InjectModel(CommunitySchema.name)
        communityModel: Model<CommunitySchema>,
        communitySchemaFactory: CommunitySchemaFactory,
    ) {
        super(communityModel, communitySchemaFactory);
    }

    async findCommunitiesByUserId(id: string): Promise<CommunityDto[]> {
        const allCommunities = await this.findAll();
        const filteredCommunities = allCommunities.filter(community => {
            const members = community.members as string[];
            const isMember = members.includes(id);
            return !isMember;
        });
        return filteredCommunities;
    }

    async findCommunitiesByKeyword(keyword: string): Promise<CommunityDto[]> {
        const lowerCaseKeywords = keyword.toLowerCase();
        const allCommunities = await this.findAll();
        const filteredCommunities = allCommunities.filter(community => {
            if (!community) {
                return false; // Skip if community or members is undefined
            }

            const name = community.name ? community.name.toLowerCase() : '';
            const description = community.about ? community.about.toLowerCase() : '';
            const categories = community.categories ? (community.categories as string[]).map(category => category.toLowerCase()) : [];
            
            const isCategoryMatch = categories.includes(lowerCaseKeywords);
            const isNameMatch = name.includes(lowerCaseKeywords);
            const isDescriptionMatch = description.includes(lowerCaseKeywords);
            return isNameMatch || isDescriptionMatch || isCategoryMatch;
        });
        return filteredCommunities;
    }
}