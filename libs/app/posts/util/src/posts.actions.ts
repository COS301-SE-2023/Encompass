import { UpdatePostRequest } from "@encompass/api/post/data-access";

export class UpdatePost{
  static readonly type = '[Comments] Update Post';
  constructor(public readonly postId: string, public readonly postUpdateRequest: UpdatePostRequest){}
}

export class GetPost{
  static readonly type = '[Comments] Get Post';
  constructor(public readonly postId: string){}
}