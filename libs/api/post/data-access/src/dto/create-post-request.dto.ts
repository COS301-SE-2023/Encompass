export class CreatePostRequest{
  readonly community!: string;
  readonly title!: string;
  readonly text!: string;
  readonly username!: string;
  readonly imageUrl!: string | null;
  communityImageUrl!: string | null;
  readonly categories!: string [];
  readonly likes!: string [];
  readonly dislikes!: string [];
  readonly spoiler!: boolean;
  readonly ageRestricted!: boolean;
}