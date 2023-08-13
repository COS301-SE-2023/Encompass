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
  readonly members!: string[] | null;

  @Prop()
  readonly quiz!: string[] | null;

  @Prop()
  readonly memo!: string[] | null;

  @Prop()
  readonly prompt!: string[] | null;
  
}