
export class SearchPosts{
    static readonly type = '[Search] Search Posts';
    constructor(public readonly keyword: string){}
}

export class SearchProfiles{
    static readonly type = '[Search] Search Profiles';
    constructor(public readonly keyword: string){}
}

export class SearchCommunities{
    static readonly type = '[Search] Search Communities';
    constructor(public readonly keyword: string){}
}