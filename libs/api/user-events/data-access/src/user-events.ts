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

  addEvent(eventId: string){
    const newEvent = {
      eventId: eventId,
      userAnswers: [],
      numCorrect: 0,
      quizComplete: false
    }

    if(this.events){
      this.events = [...this.events, newEvent]
    }

    else{
      this.events = [newEvent]
    }
  }
}