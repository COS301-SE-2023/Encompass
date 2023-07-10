import { ObjectId } from "mongoose";

export class ProfileDto {
  readonly _id!: string ;
  readonly username!: string;
  readonly name!: string;
  readonly lastName!: string;
  readonly categories!: string [];
  readonly communities!: string [];
  readonly awards!: string [];
  readonly events!: string [];
  readonly followers!: string [];
  readonly following!: string [];
  readonly posts!: string [];
  readonly reviews!: string [];
  readonly profileImage!: string;
  readonly profileBanner!: string;
  readonly bio!: string;
}