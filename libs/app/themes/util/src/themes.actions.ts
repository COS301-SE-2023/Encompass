export class GetUserSettings{
  static readonly type = '[Themes] Get User Settings';
  constructor(public readonly userId: string){}
}