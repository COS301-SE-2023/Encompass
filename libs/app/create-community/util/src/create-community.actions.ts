import { CreateCommunityRequest } from "@encompass/api/community/data-access";

export class CreateCommunity{
  static readonly type = '[CreateCommunity] CreateCommunity';
  constructor(public createCommunityRequest: CreateCommunityRequest){}
}