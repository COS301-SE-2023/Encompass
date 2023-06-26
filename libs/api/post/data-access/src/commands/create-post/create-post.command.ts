import { CreatePostRequest } from '../../dto/create-post-request.dto';

export class CreatePostCommand{
  constructor(public readonly createPostRequest: CreatePostRequest){}
}