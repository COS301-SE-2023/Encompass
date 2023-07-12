import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { CommunityRequest } from "../community-request";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommunityRequestSchema } from "./community-request.schema";
import { CommunityRequestSchemaFactory } from "./community-request-schema.factory";

@Injectable()
export class CommunityRequestEntityRepository extends BaseEntityRepository<
  CommunityRequestSchema,
  CommunityRequest
> {
  constructor(
    @InjectModel(CommunityRequestSchema.name)
    communityRequestModel: Model<CommunityRequestSchema>,
    communityRequestSchemaFactory: CommunityRequestSchemaFactory,
  ){
    super(communityRequestModel, communityRequestSchemaFactory)
  }
}