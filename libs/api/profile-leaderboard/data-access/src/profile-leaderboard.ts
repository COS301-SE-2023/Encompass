import { AggregateRoot } from "@nestjs/cqrs";

export class ProfileLeaderboard extends AggregateRoot{
  constructor(
    public readonly _id: string,
    public name: string,
    public lastName: string,
    public ep: number,
    public username: string,
    public profileImage: string
  ){
    super()
  }

  getId(): string {
    return this._id;
  }

  getName(): string {
    return this.name;
  }

  getLastName(): string {
    return this.lastName;
  }

  getEp(): number {
    return this.ep;
  }

  getUsername(): string {
    return this.username;
  }

  getProfileImage(): string {
    return this.profileImage;
  }
}