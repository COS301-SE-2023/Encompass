export class GetLeaderboard {
  static readonly type = '[Event] Get Leaderboard';
}

export class GetEvents {
  static readonly type = '[Event] Get Events';
  constructor(public readonly communities: string[]) {}
}