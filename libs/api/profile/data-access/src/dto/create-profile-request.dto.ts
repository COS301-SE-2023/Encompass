import { ObjectId } from "mongoose";

export class CreateProfileRequest{
  _id!: string;
  username!: string;
  firstName!: string;
  lastName!: string;
  category!: Array<string>;
  awards!: Array<string>;
  events!: Array<ObjectId>;
  followers!: Array<ObjectId>;
  following!: Array<ObjectId>;
  posts!: Array<ObjectId>;
  reviews!: Array<ObjectId>;
}