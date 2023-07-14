export class UpdateProfileRequest{
  username!: string;
  name!: string;
  lastName!: string;
  categories!: string [];
  communities!: string [];
  awards!: string [];
  events!: string [];
  followers!: string [];
  following!: string [];
  posts!: string [];
  reviews!: string [];
  profileImage!: string | null;
  profileBanner!: string | null;
  bio!: string | null;
}