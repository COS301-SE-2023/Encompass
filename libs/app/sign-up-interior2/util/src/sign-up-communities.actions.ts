export class GetCommunities{
  static readonly type = '[Sign-Up-Communities] Get Communities';
  constructor(public userId: string, public username: string){}
}