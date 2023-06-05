import { Injectable } from '@nestjs/common';
import { Community } from '../community';
import { CommunitySchema } from './community.schema';
import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { ObjectId } from 'mongodb';

@Injectable()
export class CommunitySchemaFactory
    implements EntitySchemaFactory<CommunitySchema, Community> {
    create(community: Community): CommunitySchema {
        return {
            _id: new ObjectId(community.getId()),
            name: community.getName(),
            admin: community.getAdmin(),
            about: community.getAbout(),
            members: community.getMembers(),
            events: community.getEvents(),
            posts: community.getPosts(),
        };
    }

    createFromSchema(communitySchema: CommunitySchema): Community {
        return new Community(
            communitySchema._id.toHexString(),
            communitySchema.name,
            communitySchema.admin,
            communitySchema.about,
            communitySchema.members,
            communitySchema.events,
            communitySchema.posts,
        );
    }
}