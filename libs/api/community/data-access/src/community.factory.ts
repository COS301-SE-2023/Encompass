import { Injectable } from '@angular/core';
import { Community } from './community';
import { EntityFactory } from "@encompass/api/database/data-access";
import { ObjectId } from 'mongodb';
import { CommunityCreatedEvent } from './events';
import { CommunityEntityRepository } from './db/community-entity.repository';

@Injectable()
export class CommunityFactory implements EntityFactory<Community> {
    constructor(private readonly communityEntityRepository: CommunityEntityRepository) {}

    async create(
        _id: string,
        name: string,
        admin: string,
        about: string,
        members: string[],
        events: string[],
        posts: string[],
    ): Promise<Community> {
        const community = new Community(
            new ObjectId().toHexString(),
            name,
            admin,
            about,
            members,
            events,
            posts,
        );
        await this.communityEntityRepository.create(community);
        community.apply(new CommunityCreatedEvent(community.getId()));
        return community;
    }
}
