import { Controller, Post, Body, Patch, Param, Delete, Get } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { PostDto } from "./post.dto";
import { CreatePostCommand } from "./commands/create-post/create-post.command";
import { CreatePostRequest } from "./dto/create-post-request.dto";
import { UpdatePostCommand } from "./commands/update-post/update-post.command";
import { DeletePostCommand } from "./commands/delete-post/delete-post.command";
import { UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { Multer } from "multer";
import { UploadedFile } from "@nestjs/common";
import { UploadImage } from "./upload-image.service";
import { GetAllPostsQuery } from "./queries/getAllPosts.query";
import { UpdatePostRequest } from "./dto/update-post-request.dto";
import { UserIdGetPostQuery } from "./queries/userId-get-post/userId-get-post.query";
import { GetByIdQuery } from "./queries/get-by-id/get-by-id.query";
import { GetByCommunityQuery } from "./queries/get-by-community/get-by-community.query";
import { GetPopularPostsQuery } from "./queries/get-popular/getPopularPosts.query";
import { GetLatestPostsQuery } from "./queries/get-latest/getLatestPosts.query";
import { GetPostsByKeywordQuery } from "./queries/search-posts/get-posts-by-keyword.query";
import { GetRecommendedPostsQuery } from "./queries/get-recommended-posts/getRecommendedPosts.query";
import { DislikePostCommand } from "./commands/dislike-post/dislike-post.command";

@Controller('post')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ){}

  @Get('get-latest/:username')
  async getLatestPosts(@Param('username') username: string){
    return await this.queryBus.execute<GetLatestPostsQuery, PostDto[]>(
      new GetLatestPostsQuery(username),
    );
  }

  @Post('create')
  async createPost(
    @Body() createPostRequest: CreatePostRequest,
  ) {
    return await this.commandBus.execute<CreatePostCommand, PostDto>(
      new CreatePostCommand(createPostRequest),
    );
  }

  @Get('get-posts-by-keyword/:keyword')
  async getPostsByKeyword(@Param('keyword') keyword: string){
      return await this.queryBus.execute<GetPostsByKeywordQuery, PostDto[]>(
          new GetPostsByKeywordQuery(keyword),
      );
  }

  @Get('get-posts-by-category/:category')
  async getPostsByCategory(@Param('category') category: string){
      return await this.queryBus.execute<GetPostsByKeywordQuery, PostDto[]>(
          new GetPostsByKeywordQuery(category),
      );
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostRequest: UpdatePostRequest,
  ){
    return await this.commandBus.execute<UpdatePostCommand, PostDto>(
      new UpdatePostCommand(id, updatePostRequest),
    );
  }

  /*@Patch('like/:userId/:postId')
  async likePost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ){
    return await this.commandBus.execute<LikePostCommand, PostDto>(
      new LikePostCommand(userId, postId),
    );
  }*/

  @Patch('dislike/:userId/:postId')
  async dislikePost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ){
    return await this.commandBus.execute<DislikePostCommand, PostDto>(
      new DislikePostCommand(userId, postId),
    );
  }

  @Delete('delete/:id')
  async deletePost(
    @Param('id') id: string,
  ){
    return await this.commandBus.execute<DeletePostCommand, string>(
      new DeletePostCommand(id),
    );
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ){
    console.log("Here")
    const uploadImage = new UploadImage();
    
    return await uploadImage.uploadImage(file.buffer, file.originalname);
  }

  @Get('get-all')
  async getAllPosts(){
    return await this.queryBus.execute<GetAllPostsQuery, PostDto[]>(
      new GetAllPostsQuery(),
    );
  }

  

  @Get('get-recommended-posts/:id')
  async getRecommendedPosts( @Param('id') id: string){
    return await this.queryBus.execute<GetRecommendedPostsQuery, PostDto[]>(
      new GetRecommendedPostsQuery(id),
    );
  }

  @Get('get-popular/:username')
  async getPopularPosts(
    @Param('username') username: string,
  ){
    return await this.queryBus.execute<GetPopularPostsQuery, PostDto[]>(
      new GetPopularPostsQuery(username),
    );
  }

  


  @Get('get-by-user/:username')
  async getPostsByUserId(
    @Param('username') username: string,
  ){
    return await this.queryBus.execute<UserIdGetPostQuery, PostDto[]>(
      new UserIdGetPostQuery(username),
    );
  }

  @Get('get-by-community/:communityName')
  async getPostsByCommunity(
    @Param('communityName') communityName: string,
  ){
    return await this.queryBus.execute<GetByCommunityQuery, PostDto[]>(
      new GetByCommunityQuery(communityName),
    );
  }

  @Get(':id')
  async getPostById(
    @Param('id') id: string,
  ){
    return await this.queryBus.execute<GetByIdQuery, PostDto>(
      new GetByIdQuery(id),
    );
  }
}