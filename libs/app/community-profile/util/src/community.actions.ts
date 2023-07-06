export class GetCommunity{
    static readonly type = '[Community] Get Community';
    constructor(public name: string){}
}

export class GetCommunityPosts{
    static readonly type = '[Community] Get Community Posts';
    constructor(public name: string){}
}   