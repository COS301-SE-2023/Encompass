export class CreatePostRequest{
  readonly community!: string;
  readonly title!: string;
  readonly text!: string;
  readonly username!: string;
  readonly imageUrl!: string | null;
  readonly categories!: string [] | null;
  readonly likes!: string [] | null;
  readonly spoiler!: boolean;
  readonly ageRestricted!: boolean;
}