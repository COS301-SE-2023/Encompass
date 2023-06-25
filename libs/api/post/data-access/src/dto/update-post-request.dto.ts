export class UpdatePostRequest{
  title!: string;
  text!: string;
  imageUrl!: string | null;
  categories!: string [];
  likes!: string [];
  spoiler!: boolean;
  ageRestricted!: boolean;
  shares!: number;
  comments!: number;
}