export class MessagesDto{
  constructor(
    public username: string,
    public name: string,
    public lastName: string,
    public profilePicture: string,
    public chatId: string,
  ){}
}