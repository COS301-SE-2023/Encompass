import { UpdateEventRequest } from "@encompass/api/user-events/data-access";

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

export class UpdateUserEvent{
  static readonly type = '[Event] Update User Event';
  constructor(public readonly userId: string, public readonly event: UpdateEventRequest){}
}

export class AddUser{
  static readonly type = '[Event] Add User';
  constructor(public readonly eventId: string, public readonly username: string){}
}

export class AddUserEvent{
  static readonly type = '[Event] Add User Event';
  constructor(public readonly eventId: string, public readonly userId: string){}
}

export class GetByCommunity{
  static readonly type = '[Event] Get By Community';
  constructor(public readonly community: string){}
}

export class GetByUsername{
  static readonly type = '[Event] Get By User Username';
  constructor(public readonly username: string){}
}