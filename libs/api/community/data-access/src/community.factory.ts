import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { CommunityEntityRepository } from "./db/community-entity.repository";
import { ObjectId } from "mongodb";
import { CommunityCreatedEvent } from "./events";
import { Community } from "./community";

@Injectable()
export class CommunityFactory implements EntityFactory<Community> {
    constructor(
        private readonly communityEntityRepository: CommunityEntityRepository,
    ){}

    async create(
        name: string,
        type: string,
        admin: string,
        about: string,
        rules: string,
        groupImage: string,
        categories: string[],
        events: string[],
        posts: string[],
        members: string[],
        ageRestricted: boolean,
    ): Promise<Community> {
        const community = new Community(
            new ObjectId().toHexString(),
            name,
            type,
            admin,
            about,
            rules,
            groupImage,
            categories,
            events,
            posts,
            members,
            ageRestricted,
            this.createDateAsString(),
        );
        await this.communityEntityRepository.create(community);
        community.apply(new CommunityCreatedEvent(community.getId()));
        return community;
    }

    createDateAsString(): string {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
    
        return dateString;
    }
}