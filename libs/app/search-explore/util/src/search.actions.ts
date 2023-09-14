import { UpdatePostRequest } from '@encompass/api/post/data-access';

export class SearchPosts {
  static readonly type = '[Search] Search Posts';
  constructor(public readonly keyword: string) {}
}

export class SearchPostsByCategory {
  static readonly type = '[Search] Search Posts By Category';
  constructor(public readonly category: string) {}
}

export class SearchProfiles {
  static readonly type = '[Search] Search Profiles';
  constructor(public readonly keyword: string) {}
}

export class SearchCommunities {
  static readonly type = '[Search] Search Communities';
  constructor(public readonly keyword: string) {}
}

export class GetAllCommunities {
  static readonly type = '[Search] Get All Communities';
}

export class GetAllProfiles {
  static readonly type = '[Search] Get All Profiles';
}

export class UpdatePost {
  static readonly type = '[Search] Update Post';
  constructor(
    public readonly postId: string,
    public readonly updateRequest: UpdatePostRequest
  ) {}
}

