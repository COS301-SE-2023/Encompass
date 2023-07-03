export class ChatDto{
  readonly _id!: string;
  readonly users!: string[];
  readonly messages!: {
    username: string;
    message: string;
    dateTime: Date;
  }[];
}