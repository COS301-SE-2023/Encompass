import { CreatePostRequest } from '@encompass/api/post/data-access';

export class CreatePost{
  static readonly type = '[Post] Create Post';
  constructor(public readonly createPostRequest: CreatePostRequest){}
}