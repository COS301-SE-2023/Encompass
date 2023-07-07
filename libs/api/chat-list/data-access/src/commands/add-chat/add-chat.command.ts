export class AddChatCommand{
  constructor(
    public readonly username: string,
    public readonly chatRef: string,
    public readonly otherUser: string
  ){}
}