import { Prop, Schema } from "@nestjs/mongoose";
import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";

@Schema({ versionKey: false, collection: 'Movies' })
export class MovieSchema extends IdentifiableEntitySchema {
  @Prop()
  readonly Release_Date!: string; // Assuming the original value is a string in ISO 8601 format

  @Prop()
  readonly Title!: string;

  @Prop()
  readonly Overview!: string;

  @Prop()
  readonly Popularity!: number;

  @Prop()
  readonly Vote_Count!: number;

  @Prop()
  readonly Vote_Average!: number;

  @Prop()
  readonly Original_Language!: string;

  @Prop()
  readonly Genre!: string;

  @Prop()
  readonly Poster_Url!: string;
}