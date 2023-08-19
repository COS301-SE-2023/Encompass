import { AggregateRoot } from "@nestjs/cqrs";

export class UserEvents extends AggregateRoot{
  constructor(
    public _id: string,
    public events : {
      eventId: string,
      userAnswers: string[],
      numCorrect: number,
      quizComplete: boolean
    }[]
  ){
    super();
  }

  getId(): string{
    return this._id
  }

  getEvents():{
    eventId: string,
    userAnswers: string[],
    numCorrect: number,
    quizComplete: boolean
  }[]{
    return this.events;
  }
}