import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteCommunityCommand } from "./delete-community.command";
import { CommunityEntityRepository } from "../../db/community-entity.repository";
import { HttpService } from "@nestjs/axios";

@CommandHandler(DeleteCommunityCommand)
export class DeleteCommunityHandler implements ICommandHandler<DeleteCommunityCommand>{
  constructor(private readonly communityEntityRepository: CommunityEntityRepository, private readonly httpService: HttpService){}

  async execute({ communityName }: DeleteCommunityCommand){

    const url = process.env["BASE_URL"];

    const community = await this.communityEntityRepository.findOneByName(communityName);

    const postIds : string[] = community.posts
    const profileUsernames : string[] = community.members

    postIds.forEach(element => {
      try{
        this.httpService.delete(url + '/api/post/delete/' + element).toPromise();
      }

      catch(error){
        console.log(error);
      }
    });

    profileUsernames.forEach(element => {
      try{
        this.httpService.patch(url + '/api/profile/remove-community/' + element + '/' + communityName).toPromise();
      }

      catch(error){
        console.log(error);
      }
    })

    await this.communityEntityRepository.findAndDeleteByName(communityName);

    return communityName;
  }
}