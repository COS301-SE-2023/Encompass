import { Controller, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { PostDto } from "./post.dto";
import { CreatePostCommand } from "./commands/create-post/create-post.command";
import { CreatePostRequest } from "./dto/create-post-request.dto";
import { UpdatePostCommand } from "./commands/update-post/update-post.command";
import { DeletePostCommand } from "./commands/delete-post/delete-post.command";
import { UploadImageCommand } from "./commands/upload-image/upload-image.command";

@Controller('post')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ){}

  @Post('create')
  async createPost(
    @Body() createPostRequest: CreatePostRequest,
  ) {
    return await this.commandBus.execute<CreatePostCommand, PostDto>(
      new CreatePostCommand(createPostRequest),
    );
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostRequest: CreatePostRequest,
  ){
    return await this.commandBus.execute<UpdatePostCommand, PostDto>(
      new UpdatePostCommand(id, updatePostRequest),
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
  async uploadImage(
    @Body() image: FormData,
  ){
    return await this.commandBus.execute<UploadImageCommand, string>(
      new UploadImageCommand(image),
    );
  }
}