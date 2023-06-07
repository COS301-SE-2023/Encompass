export class UpdatePostRequest{
  title!: string;
  text!: string;
  imageUrl!: string | null;
  categories!: string [] | null;
  likes!: string [] | null;
}