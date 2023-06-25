import { UpdatePostRequest } from "@encompass/api/post/data-access";

export class getHome{
  static readonly type = '[Home] Get Home';
}

export class GetAllPosts{
  static readonly type = '[Home] Get All Posts';
}

export class UpdatePost{
  static readonly type = '[Home] Update Post';
  constructor(public readonly postId: string, public readonly updateRequest: UpdatePostRequest){}
}