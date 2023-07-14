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