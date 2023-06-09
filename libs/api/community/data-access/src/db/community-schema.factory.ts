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
            admin: community.admin,
            about: community.about,
            events: community.events,
            posts: community.posts,
            members: community.members,
        };
    }

    createFromSchema(communitySchema: CommunitySchema): Community {
        return new Community(
            communitySchema._id.toHexString(),
            communitySchema.name,
            communitySchema.admin,
            communitySchema.about,
            communitySchema.events,
            communitySchema.posts,
            communitySchema.members,
        );
    }
}