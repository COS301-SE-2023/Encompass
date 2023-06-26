import { Injectable } from "@nestjs/common";
import { Community } from "../community";
import { CommunitySchema } from "./community.schema";
import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { ObjectId } from "mongodb";

@Injectable()
export class CommunitySchemaFactory
    implements EntitySchemaFactory<CommunitySchema, Community> {
    create(community: Community): CommunitySchema {
        return {
            _id: new ObjectId(community.getId()),
            name: community.name,
            type: community.type,
            admin: community.admin,
            about: community.about,
            rules: community.rules,
            groupImage: community.groupImage,
            categories: community.categories,
            events: community.events,
            posts: community.posts,
            members: community.members,
            ageRestricted: community.ageRestricted,
            createdAt: community.createdAt,
        };
    }

    createFromSchema(communitySchema: CommunitySchema): Community {
        return new Community(
            communitySchema._id.toHexString(),
            communitySchema.name,
            communitySchema.type,
            communitySchema.admin,
            communitySchema.about,
            communitySchema.rules,
            communitySchema.groupImage,
            communitySchema.categories,
            communitySchema.events,
            communitySchema.posts,
            communitySchema.members,
            communitySchema.ageRestricted,
            communitySchema.createdAt,
        );
    }
}