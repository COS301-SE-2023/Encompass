import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateChatCommand } from "./create-chat.command";
import { ChatFactory } from "../../chat.factory";
import { EventPublisher } from "@nestjs/cqrs";
import { HttpService } from "@nestjs/axios";


@CommandHandler(CreateChatCommand)
export class CreateChatHandler implements ICommandHandler<CreateChatCommand> {
  constructor(
    private readonly chatFactory: ChatFactory,
    private readonly eventPublisher: EventPublisher,
    private readonly httpService: HttpService
  ){}

  async execute({ createChatRequest }: CreateChatCommand){

    const url = process.env["BASE_URL"];

    const {
      users,
    } = createChatRequest;

    const chat = this.eventPublisher.mergeObjectContext(
      await this.chatFactory.create(
        users,
        [],
      )
    );

    chat.commit();
    
    try{
      this.httpService.post(url + '/api/chat-list/add-chat/' + users[0], {chatRef: chat._id, otherUser: users[1]}).toPromise();
      this.httpService.post(url + '/api/chat-list/add-chat/' + users[1], {chatRef: chat._id, otherUser: users[0]}).toPromise();
    }

    catch(error){
      console.log(error);
    }

    return chat;
  }
}