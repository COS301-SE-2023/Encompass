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
            const post = this.eventPublisher.mergeObjectContext(
                await this.postEntityRepository.findOneById(postId),
            )

            const userPromise = this.httpService.get(url + '/api/profile/get/' + userId).toPromise();
            const userResponse = await Promise.resolve( userPromise );
            //const post = postResponse?.data;
            const user = userResponse?.data;
            let updatedPost = false;
            let unlikedPost = false;

            //add user's username to post's likes if user hasn't liked the post yet, otherwise remove the username from the likes
            if (!post.likes.includes(user.username)) {
                post.likes.push(user.username);
                updatedPost = true;
            } else {
                post.likes = post.likes.filter((username: string) => username !== user.username);
                unlikedPost = true;
            }


            //remove user's username from post's dislikes if user has disliked the post
            if (post.dislikes.includes(user.username)) {
                post.dislikes = post.dislikes.filter((username: string) => username !== user.username);
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
                        //if an increase in score would make it greater than 1, set it to 1
                        if (userCategory.score + 0.1 > 1) {
                            userCategory.score = 1;
                        } else {
                            userCategory.score += 0.1;
                        }
                    } else {
                        userCategories.push({ category: postCategory, score: 0.1 });
                    }
                });
    
                //update user in database
                this.httpService.patch(url + '/api/profile/update/' + userId, user).toPromise();
                this.httpService.patch(url + '/api/profile/add-coins/' + post.username + '/1').toPromise();
            }

            if (unlikedPost) {
                //update post in database
                this.postEntityRepository.findOnePostAndReplaceById(postId, post);

                postCategories.forEach((postCategory: any) => {
                    const userCategory = userCategories.find((userCategory: any) => userCategory.category === postCategory);
                    if (userCategory) {
                        //if a decrease in score would make it less than 0, set it to 0
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

            return post;
        } catch (error) {
        
            console.log(error);
            return null;
        }
    }
}
