import { CreateCommunityRequest } from "@encompass/api/community/data-access";
import { ProfileDto } from "@encompass/api/profile/data-access";

export class CreateCommunity{
  static readonly type = '[CreateCommunity] CreateCommunity';
  constructor(public createCommunityRequest: CreateCommunityRequest, public profile: ProfileDto){}
}

export class CheckCommunity{
  static readonly type = '[CreateCommunity] CheckAccount'
  constructor(public request: string){}
}

export class AddPost{
  static readonly type = '[CreateCommunity] AddPost'
  constructor(public name: string, public id: string){}
}

export class UploadFile{
  static readonly type = '[Post] Upload File';
  constructor(public readonly file: FormData){}
}

export class AddEvent{
  static readonly type = '[CreateCommunity] AddEvent'
  constructor(public name: string, public id: string){}
}
