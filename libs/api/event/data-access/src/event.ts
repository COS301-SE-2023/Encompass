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
    public members: string[],
    public quiz:  {
      question: string;
      options: string[];
      answer: string;
    }[] | null,
    public prompt: string[] | null,
    public categories: string[] | null,
    public quizDescription: string[] | null,
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

  getMembers(): string []{
    return this.members;
  }

  getQuiz():  {
    question: string;
    options: string[];
    answer: string;
  }[] | null{
    return this.quiz;
  }

  getPrompt(): string [] | null{
    return this.prompt;
  }
  
  getCategories(): string [] | null{
    return this.categories;
  }

  getQuizDescription(): string[] | null{
    return this.quizDescription;
  }
  
  addUser(username: string){
    this.members = [...this.members, username];
  }
}