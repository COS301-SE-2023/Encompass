import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({versionKey: false, collection: 'user-events'})
export class UserEventsSchema extends IdentifiableEntitySchema{
  @Prop()
  readonly events!: {
    eventId: string,
    userAnswers: string[],
    numCorrect: number,
    quizComplete: boolean
  }[]
}