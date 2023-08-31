import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { EventEntityRepository } from "./db/event-entity.repository";
import { ObjectId } from "mongodb";
import { EventCreatedEvent } from "./events";
import { Event } from "./event";
import { GetQuestions } from "./get-questions.service";

@Injectable()
export class EventFactory implements EntityFactory<Event>{
  questionsGenerator = new GetQuestions();

  constructor(
    private readonly eventEntityRepository: EventEntityRepository,
  ){}

  async create(
    name: string | null,
    host: string | null,
    community: string | null,
    description: string | null,
    startDate: Date | null,
    endDate: Date | null,
    members: string[] | null,
    prompt: string[] | null,
    categories: string[] | null,
  ) : Promise<Event>{
    
    const questions = await this.getQuestions();
    
    const event = new Event(
      new ObjectId().toHexString(),
      name,
      host,
      community,
      description,
      startDate,
      endDate,
      members,
      questions,
      prompt,
      categories,
    );
    await this.eventEntityRepository.create(event);
    event.apply(new EventCreatedEvent(event.getId()))
    return event;
  }

  async getQuestions(){
    const questions = await this.questionsGenerator.getQuestions();
    return questions
  }
}