import { CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import { GetCommunityCommand } from "./community.command"
import { CommunityEntityRepository } from "../db/community-entity.repository";
import { EventPublisher } from "@nestjs/cqrs";

@CommandHandler(GetCommunityCommand)
export class GetCommunityHandler implements ICommandHandler<GetCommunityCommand> {
    constructor(
        private readonly communityEntityRepository: CommunityEntityRepository,
        private readonly eventPublisher: EventPublisher,
    ) {}

    async execute({ _id, name, admin, about, members, events, posts }: GetCommunityCommand) {
        const community = await this.eventPublisher.mergeObjectContext(
            await this.communityEntityRepository.findOneById( _id ),
        );
    }
}