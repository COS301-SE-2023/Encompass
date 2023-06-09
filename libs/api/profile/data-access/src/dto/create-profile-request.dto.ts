export class CreateProfileRequest{
  _id!: string;
  username!: string;
  name!: string | null;
  lastName!: string | null;
  categories!: string [] | null;
  communities!: string [] | null;
  awards!: string [] | null;
  events!: string [] | null;
  followers!: string [] | null;
  following!: string [] | null;
  posts!: string [] | null;
  reviews!: string [] | null;
  profileImage!: string | null;
  bio!: string | null;
}