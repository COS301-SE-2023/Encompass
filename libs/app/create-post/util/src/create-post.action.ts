import { CreateEventRequest } from '@encompass/api/event/data-access';
import { CreatePostRequest } from '@encompass/api/post/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';

export class UploadFile{
  static readonly type = '[Post] Upload File';
  constructor(public readonly file: FormData){}
}

export class CreateEvent{
  static readonly type = '[Post] Create Event';
  constructor(public readonly createEventRequest: CreateEventRequest, public readonly profile: ProfileDto){}
}