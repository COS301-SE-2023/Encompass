import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { LikePostCommand } from "./like-post.command";
import { PostEntityRepository } from "../../db/post-entity.repository";
import { HttpService } from "@nestjs/axios";

@CommandHandler(LikePostCommand)
export class LikePostHandler implements ICommandHandler<LikePostCommand> {
    constructor(
        private readonly postEntityRepository: PostEntityRepository,
        private readonly eventPublisher: EventPublisher,
        private readonly httpService: HttpService,
    ){}
    
    async execute({ userId, postId }: LikePostCommand) {
        const url = process.env["BASE_URL"];
        
        try {
            const postPromise = this.httpService.get(url + '/api/post/' + postId).toPromise();
            const userPromise = this.httpService.get(url + '/api/profile/get/' + userId).toPromise();
            const [postResponse, userResponse] = await Promise.all([postPromise, userPromise]);
            const post = postResponse?.data;
            const user = userResponse?.data;
            let updatedPost = false;

            //add user's username to post's likes if user hasn't liked the post yet
            if (!post.likes.includes(user.username)) {
                post.likes.push(user.username);
                updatedPost = true;
            }

            //remove user's username from post's dislikes if user has disliked the post
            if (post.dislikes.includes(user.username)) {
                post.dislikes = post.dislikes.filter((username: any) => username !== user.username);
                updatedPost = true;
            }

            //update post in database
            if (updatedPost) {
                await this.postEntityRepository.findOnePostAndReplaceById(postId, post);
            }
            return post;
        } catch (error) {
            console.log(error);
        }
    }
}
