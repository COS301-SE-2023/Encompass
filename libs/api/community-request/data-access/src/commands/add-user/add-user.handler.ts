import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddUserCommand } from "./add-user.command";
import { CommunityRequestEntityRepository } from "../../db/community-request-entity.repository";
import { EventPublisher } from "@nestjs/cqrs";

@CommandHandler(AddUserCommand)
export class AddUserHandler implements ICommandHandler<AddUserCommand>{
  constructor(
    private readonly communityRequestEntityRepository: CommunityRequestEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({communityId, username}: AddUserCommand) {
    const communityRequest = this.eventPublisher.mergeObjectContext(
      await this.communityRequestEntityRepository.findOneById(communityId)
    )

    communityRequest.addRequestUsername(username);
    await this.communityRequestEntityRepository.findOneAndReplaceById(communityRequest._id, communityRequest);
    communityRequest.commit();

    return communityRequest
  }
}