export class GateWayAddMessageRequest {
  constructor(
    public readonly username: string,
    public readonly message: string,
    public readonly chatId: string,
  ){}
}