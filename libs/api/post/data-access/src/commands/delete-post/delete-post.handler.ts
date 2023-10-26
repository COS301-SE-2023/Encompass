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
    const url = process.env["BASE_URL"] ;

    const post = await this.postEntityRepository.findOneById(id);
   
    try{
      this.httpService.patch(url + '/api/community/remove-post/' + post.community + '/' + id).toPromise();
      this.httpService.patch(url + '/api/profile/remove-post/' + post.username + '/' + id).toPromise();
      this.httpService.delete(url + '/api/comment/delete-by-post-id/' + id).toPromise();
    }

    catch(error){
      console.log(error);
    }
    
    await this.postEntityRepository.findAndDelete(id);

    // console.log(id)
    return id;
  }
}