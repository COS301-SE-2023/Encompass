export class CommentDto{
  readonly _id!: string;
  readonly postId!: string;
  readonly username!: string;
  readonly text!: string;
  readonly replies!: {
    id: string;
    username: string;
    text: string;
    dateAdded: Date;
    profileImage: string;
  }[];
  readonly dateAdded!: Date;
  readonly profileImage!: string;
}