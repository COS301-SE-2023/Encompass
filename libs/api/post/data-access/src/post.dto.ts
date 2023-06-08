export class PostDto{
  readonly id!: string;
  readonly communityId!: string;
  readonly title!: string;
  readonly text!: string;
  readonly username!: string;
  readonly imageUrl!: string | null;
  readonly categories!: string [] | null;
  readonly likes!: string [] | null;
  readonly dateAdded!: Date;
}