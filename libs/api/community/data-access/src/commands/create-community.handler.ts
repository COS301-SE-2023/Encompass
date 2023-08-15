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
            bannerImage,
            categories,
            events, 
            posts, 
            members,
            ageRestricted,
            communityEP
        } = createCommunityRequest;
        const community = this.eventPublisher.mergeObjectContext( 
            await this.communityFactory.create(
            name,
            type,
            admin,
            about,
            rules,
            groupImage,
            bannerImage,
            categories,
            events,
            posts,
            members,
            ageRestricted,
            communityEP
            )
        );

        community.commit();
        return community;
    }

}