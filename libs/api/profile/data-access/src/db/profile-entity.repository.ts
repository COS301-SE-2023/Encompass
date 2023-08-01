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

  async findUsersByKeyword(keyword: string): Promise<Profile[]>{
    const lowerCaseKeyword = keyword.toLowerCase();
    const allUsers = await this.findAll();
    const filteredUsers = allUsers.filter(user => {
      const firstName = user.username.toLowerCase();
      const lastName = user?.lastName?.toLowerCase();
      const name = user?.name?.toLowerCase();
      const isNameMatch = name?.includes(lowerCaseKeyword);
      const isFirstNameMatch = firstName.includes(lowerCaseKeyword);
      const isLastNameMatch = lastName?.includes(lowerCaseKeyword);
      return isFirstNameMatch || isLastNameMatch || isNameMatch;
    });
    return filteredUsers;
  }
}