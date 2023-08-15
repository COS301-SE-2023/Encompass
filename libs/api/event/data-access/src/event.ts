import { AggregateRoot } from "@nestjs/cqrs";

export class Event extends AggregateRoot{
  constructor( 
    public readonly _id: string ,
    public name: string | null,
    public host: string | null,
    public community: string | null,
    public description: string | null,
    public startDate: Date | null,
    public endDate: Date | null,
    public members: string[] | null,
    public quiz:  {
      questions: string;
      options: string[];
    } | null,
    public memo: string[] | null,
    public prompt: string[] | null,
  ){
    super();
  }
  
  getId(): string {
    return this._id;
  }

  getName(): string | null{
    return this.name;
  }

  getHost(): string | null{
    return this.host;
  }

  getCommunity(): string | null{
    return this.community;
  }

  getDescription(): string | null{
    return this.description;
  }

  getStartDate(): Date | null{
    return this.startDate;
  }

  getEndDate(): Date | null{
    return this.endDate;
  }

  getMembers(): string [] | null{
    return this.members;
  }

  getQuiz():  {
    questions: string;
    options: string[];
  } | null | null{
    return this.quiz;
  }

  getMemo(): string [] | null{
    return this.memo;
  }

  getPrompt(): string [] | null{
    return this.prompt;
  }
  

  
}