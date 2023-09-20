import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { CreateCommunityCommand } from "./create-community.command";
import { CommunityFactory } from "../community.factory";
import { HttpService } from "@nestjs/axios";

@CommandHandler(CreateCommunityCommand)
export class CreateCommunityHandler implements ICommandHandler<CreateCommunityCommand> {
    constructor(
        private readonly communityFactory: CommunityFactory,
        private readonly eventPublisher: EventPublisher,
        private httpService: HttpService
    ) {}

    async execute({ createCommunityRequest }: CreateCommunityCommand){
        const url = process.env["BASE_URL"];


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
        
        try{
            this.httpService.patch(url + '/api/profile/add-award/' + admin + '/commAdmin').toPromise();
            this.httpService.patch(url + '/api/community-leaderboard/leaderboard').toPromise();
        }
    
        catch(error){
            console.log(error);
        }

        community.commit();
        return community;
    }

}