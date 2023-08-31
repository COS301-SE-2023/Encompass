export class EventDto {
  readonly _id!: string ;
  readonly name!: string;
  readonly host!: string;
  readonly community!: string;
  readonly description!: string;
  readonly startDate!: Date;
  readonly endDate!: Date;
  readonly members!: string[];
  readonly quiz!: {
    question: string;
    options: string[];
    answer: string;
  }[];
  readonly memo!: string[];
  readonly prompt!: string[];
  readonly categories!: string[];
}