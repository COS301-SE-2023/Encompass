import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: "event" })
export class EventSchema extends IdentifiableEntitySchema{

  @Prop()
  readonly name!: string | null;

  @Prop()
  readonly host!: string | null;

  @Prop()
  readonly community!: string | null;

  @Prop()
  readonly description!: string | null;

  @Prop()
  readonly startDate!: Date | null;

  @Prop()
  readonly endDate!: Date | null;

  @Prop()
  readonly members!: string[];

  @Prop({type: Object})
  readonly quiz!: {
    question: string;
    options: string[];
    answer: string;
  }[] | null;

  @Prop()
  readonly prompt!: string[] | null;
  
  @Prop()
  readonly categories!: string[] | null;

  @Prop()
  readonly quizDescription!: string[] | null;
}