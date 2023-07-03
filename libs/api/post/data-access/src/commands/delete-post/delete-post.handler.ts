import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { DeletePostCommand } from "./delete-post.command";
import { PostEntityRepository } from "../../db/post-entity.repository";
import { HttpService } from "@nestjs/axios";

@CommandHandler(DeletePostCommand)
export class DeletePostHandler 
  implements ICommandHandler<DeletePostCommand>{
  constructor(
    private readonly postEntityRepository: PostEntityRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly httpService: HttpService,
  ){}

  async execute({ id }: DeletePostCommand){
    

    // post.deletePost();
    await this.postEntityRepository.findAndDelete(id);

    const url = process.env["BASE_URL"] + '/api/comment/delete-by-post-id/';

    try{
      this.httpService.delete(url + id).toPromise();
    }

    catch(error){
      console.log(error);
    }
    
    return id;
  }
}