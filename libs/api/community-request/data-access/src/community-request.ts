import { AggregateRoot } from "@nestjs/cqrs";

export class CommunityRequest extends AggregateRoot{
  constructor(
    public _id: string,
    public requestUsernames: string[]
  ){
    super();
  }

  getId(): string{
    return this._id;
  }

  getRequestUsernames(): string[]{
    return this.requestUsernames;
  }
}