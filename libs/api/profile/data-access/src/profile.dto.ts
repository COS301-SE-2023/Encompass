import { ObjectId } from "mongoose";

export class ProfileDto {
  readonly id!: string | ObjectId | null | undefined;
  readonly username!: string;
  readonly firstName!: string;
  readonly lastName!: string;
  readonly category!: string [];
  readonly awards!: string [];
  readonly events!: string [];
  readonly followers!: string [];
  readonly following!: string [];
  readonly posts!: string [];
  readonly reviews!: string [];
}