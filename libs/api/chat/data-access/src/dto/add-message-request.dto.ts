export class AddMessageRequest{
  constructor(
    public readonly username: string,
    public readonly message: string,
  ){}
}