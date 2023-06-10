import { UpdateCommunityRequest } from '../../dto/update-community-request.dto';

export class UpdateCommunityCommand {
    constructor(public readonly id: string, public readonly updateCommunityRequest: UpdateCommunityRequest ) {}
}