import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemoveUserCommand } from "./remove-user.command";
import { CommunityRequestEntityRepository } from "../../db/community-request-entity.repository";
import { EventPublisher } from "@nestjs/cqrs";

@CommandHandler(RemoveUserCommand)
export class RemoveUserHandler implements ICommandHandler<RemoveUserCommand>{
  constructor(
    private readonly communityRequestEntityRepository: CommunityRequestEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({communityId, username}: RemoveUserCommand) {
    const communityRequest = this.eventPublisher.mergeObjectContext(
      await this.communityRequestEntityRepository.findOneById(communityId)
    )

    communityRequest.removeRequestUsername(username);
    await this.communityRequestEntityRepository.findOneAndReplaceById(communityRequest._id, communityRequest);
    communityRequest.commit();

    return communityRequest
  }
}