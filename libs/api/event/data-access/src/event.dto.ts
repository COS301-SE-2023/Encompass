import { ObjectId } from "mongoose";

export class EventDto {
  readonly _id!: string ;
  readonly name!: string;
  readonly host!: string;
  readonly community!: string;
  readonly description!: string;
  readonly startDate!: Date;
  readonly endDate!: Date;
  readonly members!: string[];
  readonly quiz!: string[];
  readonly memo!: string[];
  readonly prompt!: string[];
  
}