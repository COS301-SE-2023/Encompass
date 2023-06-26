import { UpdateProfileRequest } from '../../dto/update-profile-request.dto';

export class UpdateProfileCommand{
  constructor(
    public readonly id: string,
    public readonly updateProfileRequest: UpdateProfileRequest
    ){}
}