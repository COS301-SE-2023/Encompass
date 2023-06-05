import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { Profile } from "../profile";
import { ProfileSchema } from "./profile.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProfileSchemaFactory } from "./profile-schema.factory";

@Injectable()
export class ProfileEntityRepository extends BaseEntityRepository<
ProfileSchema,
Profile
>{
  constructor(
    @InjectModel(ProfileSchema.name)
    profileModel: Model<ProfileSchema>,
    profileSchemaFactory: ProfileSchemaFactory,
  ){
    super(profileModel, profileSchemaFactory);
  }
}