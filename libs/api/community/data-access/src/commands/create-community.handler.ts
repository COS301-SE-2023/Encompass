import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { CreateCommunityCommand } from "./create-community.command";
import { CommunityFactory } from "../community.factory";

@CommandHandler(CreateCommunityCommand)
export class CreateCommunityHandler implements ICommandHandler<CreateCommunityCommand> {
    constructor(
        private readonly communityFactory: CommunityFactory,
        private readonly eventPublisher: EventPublisher,
    ) {}

    async execute({ createCommunityRequest }: CreateCommunityCommand){
        const { 
            name,
            type, 
            admin, 
            about,
            rules,
            groupImage,
            categories,
            events, 
            posts, 
            members,
            ageRestricted 
        } = createCommunityRequest;
        const community = this.eventPublisher.mergeObjectContext( 
            await this.communityFactory.create(
            name,
            type,
            admin,
            about,
            rules,
            groupImage,
            categories,
            events,
            posts,
            members,
            ageRestricted
            )
        );

        community.commit();
        return community;
    }

}