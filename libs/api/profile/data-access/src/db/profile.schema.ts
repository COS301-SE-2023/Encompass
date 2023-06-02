import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: "profile" })
export class ProfileSchema extends IdentifiableEntitySchema{
  @Prop()
  readonly name!: string;

  @Prop()
  readonly lastName!: string;

  @Prop()
  readonly username!: string;

  @Prop()
  readonly categories!: string[];

  @Prop()
  readonly awards!: string[];

  @Prop()
  readonly events!: string[];

  @Prop()
  readonly followers!: string[];

  @Prop()
  readonly following!: string[];

  @Prop()
  readonly posts!: string[];

  @Prop()
  readonly reviews!: string[];
}