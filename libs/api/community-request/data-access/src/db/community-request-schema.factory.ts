import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { CommunityRequest } from "../community-request";
import { ObjectId } from "mongodb"
import { CommunityRequestSchema } from "./community-request.schema";

@Injectable()
export class CommunityRequestSchemaFactory
  implements EntitySchemaFactory<CommunityRequestSchema, CommunityRequest>{
    create(communityRequest: CommunityRequest): CommunityRequestSchema{
      return {
        _id: new ObjectId(communityRequest.getId()),
        requestUsernames: communityRequest.requestUsernames
      }
    }

    createFromSchema(communityRequestSchema: CommunityRequestSchema): CommunityRequest {
      return new CommunityRequest(
        communityRequestSchema._id.toHexString(),
        communityRequestSchema.requestUsernames
      )
    }
  }