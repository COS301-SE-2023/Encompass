import { UpdatePostRequest } from '../../dto/update-post-request.dto';

export class UpdatePostCommand {
    constructor(
    public readonly id: string,
    public readonly updatePostRequest: UpdatePostRequest
    ) {}
}