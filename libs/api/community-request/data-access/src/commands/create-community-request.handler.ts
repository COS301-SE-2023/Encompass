import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { CreateCommunityRequestCommand } from "./create-community-request.command";
import { CommunityRequestFactory } from "../community-request.factory";

@CommandHandler(CreateCommunityRequestCommand)
export class CreateCommunityRequestHandler implements ICommandHandler<CreateCommunityRequestCommand>{
  constructor(
    private readonly communityRequestFactory: CommunityRequestFactory,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({communityId}: CreateCommunityRequestCommand){
    console.log("i called create community");
    const communityRequest = this.eventPublisher.mergeObjectContext(
      await this.communityRequestFactory.create(communityId)
    )
   
    communityRequest.commit();
    return communityRequest;
  }
}