import { AggregateRoot } from '@nestjs/cqrs';

export class Home extends AggregateRoot{
  constructor(
    private readonly _id: string | undefined, 
    private readonly name: string | undefined
    ){
    super();
  }

  getId() : string  | undefined{
    return this._id;
  }

  getName() : string | undefined {
    return this.name;
  }
}