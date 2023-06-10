import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { UpdateCommunityCommand } from "./update-community.command";
import { CommunityEntityRepository } from "../../db/community-entity.repository";

@CommandHandler(UpdateCommunityCommand)
export class UpdateCommunityHandler
    implements ICommandHandler<UpdateCommunityCommand> {
        constructor(
            private readonly communityEntityRepository: CommunityEntityRepository,
            private readonly eventPublisher: EventPublisher,
        ) {}

        async execute({ id, updateCommunityRequest }: UpdateCommunityCommand) {
            const community = this.eventPublisher.mergeObjectContext(
                await this.communityEntityRepository.findOneById(id),
            );
            
            community.updateCommunity(updateCommunityRequest);
            await this.communityEntityRepository.findOneAndReplaceById(id, community);
            community.commit();

            return community;
        }
    }