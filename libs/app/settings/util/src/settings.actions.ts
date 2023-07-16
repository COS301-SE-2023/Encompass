export class GetUserSettings{
  static readonly type = '[Settings] Get User Settings';
  constructor(public userId: string){}
}