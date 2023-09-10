import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { DislikePostCommand } from "./dislike-post.command";
import { PostEntityRepository } from "../../db/post-entity.repository";
import { HttpService } from "@nestjs/axios";

@CommandHandler(DislikePostCommand)
export class DislikePostHandler implements ICommandHandler<DislikePostCommand> {
    constructor(
        private readonly postEntityRepository: PostEntityRepository,
        private readonly eventPublisher: EventPublisher,
        private readonly httpService: HttpService,
    ){}
    
    async execute({ userId, postId }: DislikePostCommand) {
        const url = process.env["BASE_URL"];
        
        try {
            const postPromise = this.httpService.get(url + '/api/post/' + postId).toPromise();
            const userPromise = this.httpService.get(url + '/api/profile/get/' + userId).toPromise();
            const [post, user] = await Promise.all([postPromise, userPromise]);
            console.log(post?.data);
            console.log("!!!!!!!!!!!!!!!!!");
            console.log(user?.data);
            return post?.data;
        } catch (error) {
            console.log(error);
        }
    }
}
