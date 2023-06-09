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
        _id: string,
        name: string,
        admin: string,
        about: string,
        events: string[],
        posts: string[],
        members: string[],
    ): Promise<Community> {
        const community = new Community(
            new ObjectId(_id).toHexString(),
            name,
            admin,
            about,
            events,
            posts,
            members,
        );
        await this.communityEntityRepository.create(community);
        community.apply(new CommunityCreatedEvent(community.getId()));
        return community;
    }
}