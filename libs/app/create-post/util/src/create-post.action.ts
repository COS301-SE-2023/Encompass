import { CreatePostRequest } from '@encompass/api/post/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';

export class CreatePost{
  static readonly type = '[Post] Create Post';
  constructor(public readonly createPostRequest: CreatePostRequest, public readonly profile: ProfileDto){}
}

export class UploadFile{
  static readonly type = '[Post] Upload File';
  constructor(public readonly file: FormData){}
}