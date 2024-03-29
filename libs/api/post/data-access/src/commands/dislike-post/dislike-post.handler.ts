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
            const post = this.eventPublisher.mergeObjectContext(
                await this.postEntityRepository.findOneById(postId),
            )
            // const postPromise = this.httpService.get(url + '/api/post/' + postId).toPromise();
            const userPromise = this.httpService.get(url + '/api/profile/get/' + userId).toPromise();
            const userResponse = await Promise.resolve(userPromise);
            // const post = postResponse?.data;
            const user = userResponse?.data;
            let updatedPost = false;
            let unDislikedPost = false;

            //add user's username to post's dislikes if user hasn't disliked the post yet
            if (!post.dislikes.includes(user.username)) {
                post.dislikes.push(user.username);
                updatedPost = true;
            } else {
                //remove user's username from post's dislikes if user has disliked the post
                post.dislikes = post.dislikes.filter((username: any) => username !== user.username);
                unDislikedPost = true;
            }

            //remove user's username from post's likes if user has liked the post
            if (post.likes.includes(user.username)) {
                post.likes = post.likes.filter((username: any) => username !== user.username);
                updatedPost = true;
            }

            
            const userCategories = user.categories;
            const postCategories = post.categories;
            if (updatedPost) {
                //update post in database
                this.postEntityRepository.findOnePostAndReplaceById(postId, post);

                postCategories.forEach((postCategory: any) => {
                    const userCategory = userCategories.find((userCategory: any) => userCategory.category === postCategory);
                    if (userCategory) {
                        //if an increase in score would make it less than 0, set it to 0
                        if (userCategory.score - 0.1 < 0) {
                            userCategory.score = 0;
                        } else {
                            userCategory.score -= 0.1;
                        }
                    }
                });

                //update user in database
                this.httpService.patch(url + '/api/profile/update/' + userId, user).toPromise();
                this.httpService.patch(url + '/api/profile/remove-coins/' + post.username + '/1').toPromise();
            }

            if (unDislikedPost) {
                //update post in database
                this.postEntityRepository.findOnePostAndReplaceById(postId, post);

                postCategories.forEach((postCategory: any) => {
                    const userCategory = userCategories.find((userCategory: any) => userCategory.category === postCategory);
                    if (userCategory) {
                        //if an increase in score would make it greater than 1, set it to 1
                        if (userCategory.score + 0.1 > 1) {
                            userCategory.score = 1;
                        } else {
                            userCategory.score += 0.1;
                        }
                    }
                });

                //update user in database
                this.httpService.patch(url + '/api/profile/update/' + userId, user).toPromise();
                this.httpService.patch(url + '/api/profile/add-coins/' + post.username + '/1').toPromise();
            }

            return post;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
