import { CreateCommunityRequest } from "@encompass/api/community/data-access";
import { ProfileDto } from "@encompass/api/profile/data-access";

export class CreateCommunity{
  static readonly type = '[CreateCommunity] CreateCommunity';
  constructor(public createCommunityRequest: CreateCommunityRequest, public profile: ProfileDto){}
}