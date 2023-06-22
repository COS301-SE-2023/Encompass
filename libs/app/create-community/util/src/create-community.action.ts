import { CreateCommunityRequest } from '@encompass/api/community/data-access';

export class CreateCommunity{
  static readonly type = '[Community] Create Community';
  constructor(public readonly createCommunityRequest: CreateCommunityRequest){}
}