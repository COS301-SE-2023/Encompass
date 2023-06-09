import { CreateCommunityRequest } from "../dto/create-community-request.dto";

export class CreateCommunityCommand {
    constructor(public readonly createCommunityRequest: CreateCommunityRequest) {}
}