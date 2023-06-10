export class CommentDto{
  readonly id!: string;
  readonly postId!: string;
  readonly username!: string;
  readonly text!: string;
  readonly replies!: {
    id: string;
    username: string;
    text: string;
    dateAdded: Date;
  }[];
  readonly dateAdded!: Date;
}