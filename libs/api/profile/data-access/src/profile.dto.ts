import { ObjectId } from "mongoose";

export class ProfileDto {
  readonly id!: string ;
  readonly username!: string;
  readonly name!: string;
  readonly lastName!: string;
  readonly category!: string [];
  readonly communities!: string [];
  readonly awards!: string [];
  readonly events!: string [];
  readonly followers!: string [];
  readonly following!: string [];
  readonly posts!: string [];
  readonly reviews!: string [];
}