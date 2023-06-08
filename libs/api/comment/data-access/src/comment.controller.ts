import { Controller, Post, Body } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateCommentCommand } from "./commands/create-comment/create-comment.command";
import { CreateCommentRequest } from "./dto/create-comment-request.dto";
import { CommentDto } from "./comment.dto";

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ){}

  @Post('create')
  async createComment(
    @Body() createCommentRequest: CreateCommentRequest,
  ){
    return await this.commandBus.execute<CreateCommentCommand, CommentDto>(
      new CreateCommentCommand(createCommentRequest),
    );
  }
}