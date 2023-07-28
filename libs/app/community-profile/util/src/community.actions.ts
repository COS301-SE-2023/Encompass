import { UpdateCommunityRequest } from "@encompass/api/community/data-access";

export class GetCommunity{
    static readonly type = '[Community] Get Community';
    constructor(public name: string){}
}

export class GetCommunityPosts{
    static readonly type = '[Community] Get Community Posts';
    constructor(public name: string){}
}   

export class UpdateCommunity{
    static readonly type = '[Community] Update Community';
    constructor(public communityId: string, public updateCommunityRequest: UpdateCommunityRequest){}
}

export class GetCommunityRequest{
    static readonly type = '[Community] Get Community Request';
    constructor(public communityId: string){}
}

export class AddCommunityRequest{
    static readonly type = '[Community] Add Community Request'
    constructor(public communityId: string, public username: string){}
}

export class RemoveCommunityRequest{
    static readonly type = '[Community] Remove Community Request';
    constructor(public communityId: string, public username: string){}
}

export class RemoveCommunity{
    static readonly type = '[Profile] Remove Community';
    constructor(public readonly communityName: string, public readonly username: string){}
  }
  
  export class AddCommunity{
    static readonly type = '[Profile] Add Community';
    constructor(public readonly communityName: string, public readonly username: string){}
  }