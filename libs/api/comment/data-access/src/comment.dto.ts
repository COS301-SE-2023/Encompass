export class CommentDto{
  readonly id!: string;
  readonly postId!: string;
  readonly username!: string;
  readonly text!: string;
  readonly dateAdded!: Date;
}