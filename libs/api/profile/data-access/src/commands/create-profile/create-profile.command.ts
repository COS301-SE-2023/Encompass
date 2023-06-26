import { CreateProfileRequest } from '../../dto/create-profile-request.dto';

export class CreateProfileCommand {
    constructor(public readonly createProfileRequest: CreateProfileRequest) {}
}