export class PostDto{
  readonly _id!: string;
  readonly community!: string;
  readonly title!: string;
  readonly text!: string;
  readonly username!: string;
  readonly imageUrl!: string | null;
  readonly communityImageUrl!: string | null;
  readonly categories!: string [];
  readonly likes!: string [];
  readonly dateAdded!: string;
  readonly spoiler!: boolean;
  readonly ageRestricted!: boolean;
  readonly shares!: number;
  readonly comments!: number;
  readonly reported!: boolean;
  readonly isPrivate!: boolean;
}