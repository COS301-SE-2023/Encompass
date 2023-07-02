import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteCommunityCommand } from "./delete-community.command";
import { CommunityEntityRepository } from "../../db/community-entity.repository";

@CommandHandler(DeleteCommunityCommand)
export class DeleteCommunityHandler implements ICommandHandler<DeleteCommunityCommand>{
  constructor(private readonly communityEntityRepository: CommunityEntityRepository){}

  async execute({ communityName }: DeleteCommunityCommand){
    await this.communityEntityRepository.findAndDeleteByName(communityName);

    return communityName;
  }
}