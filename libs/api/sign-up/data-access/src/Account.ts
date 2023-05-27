import { AggregateRoot } from "@nestjs/cqrs";

export class Account extends AggregateRoot{
  constructor(
    public readonly _id: string,
    public readonly email: string,
    public readonly password: string,
  ){
    super();
  }

  getId(): string | undefined{
    return this._id;
  }

  getEmail(): string | undefined{
    return this.email;
  }

  getPassword(): string | undefined{
    return this.password;
  }
}