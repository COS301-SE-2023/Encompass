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
        const allCommunities = await this.findAll();
        const filteredCommunities = allCommunities.filter(community => {
            const name = community.name.toLowerCase();
            const description = community.about.toLowerCase();
            const categories = community.categories as string[];
            const lowerCaseCategories = categories.map(category => category.toLowerCase());
            const isCategoryMatch = lowerCaseCategories.includes(keyword);
            const isNameMatch = name.includes(keyword);
            const isDescriptionMatch = description.includes(keyword);
            return isNameMatch || isDescriptionMatch || isCategoryMatch;
        });
        return filteredCommunities;
    }
}