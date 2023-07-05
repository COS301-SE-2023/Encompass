export class AddMessageCommand{
  constructor(
    public readonly chatId: string,
    public readonly username: string,
    public readonly message: string,
    public readonly dateTime: Date,
  ){}
}