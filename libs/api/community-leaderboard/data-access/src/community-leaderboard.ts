import { AggregateRoot } from "@nestjs/cqrs";

export class CommunityLeaderboard extends AggregateRoot{
  constructor(
    public readonly _id: string,
    public name: string,
    public communityEP: number,
    public position: number
  ){
    super();
  }

  getId(): string {
    return this._id;
  }

  getName(): string {
    return this.name;
  }

  getCommunityEP(): number {
    return this.communityEP;
  }

  getPosition(): number {
    return this.position;
  }
}