export class GetLeaderboard {
  static readonly type = '[Event] Get Leaderboard';
}

export class GetEvents {
  static readonly type = '[Event] Get Events';
  constructor(public readonly communities: string[]) {}
}

export class GetEventById{
  static readonly type = '[Event] Get Event By Id';
  constructor(public readonly id: string){}
}

export class GetUserEvents{
  static readonly type = '[Event] Get User Events';
  constructor(public readonly userId: string){}
}