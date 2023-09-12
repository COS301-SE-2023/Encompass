import { UpdateCommunityRequest } from "@encompass/api/community/data-access";
import { UpdatePostRequest } from "@encompass/api/post/data-access";

export class GetCommunity{
    static readonly type = '[Community] Get Community';
    constructor(public name: string){}
}

export class GetCommunityPosts{
    static readonly type = '[Community] Get Community Posts';
    constructor(public name: string){}
}   

export class UpdatePostArray{
    static readonly type = '[Community] Update Post Array';
    constructor(public readonly postId: string, public readonly postUpdateRequest: UpdatePostRequest){}
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

export class RemoveOtherUserCommunity{
    static readonly type = '[Profile] Remove Community';
    constructor(public readonly communityName: string, public readonly username: string){}
  }
  
  export class AddOtherUserCommunity{
    static readonly type = '[Profile] Add Community';
    constructor(public readonly communityName: string, public readonly username: string){}
  }

  export class GetRanking{
    static readonly type = '[Community] Get Ranking';
  }