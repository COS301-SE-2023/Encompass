import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: "profile" })
export class ProfileSchema extends IdentifiableEntitySchema{
  @Prop()
  readonly username!: string;

  @Prop()
  readonly name!: string | null;

  @Prop()
  readonly lastName!: string | null;

  @Prop()
  readonly categories!: string[] | null;

  @Prop()
  readonly communities!: string[] | null;
  
  @Prop()
  readonly awards!: string[] | null;

  @Prop()
  readonly events!: string[] | null;

  @Prop()
  readonly followers!: string[] | null;

  @Prop()
  readonly following!: string[] | null;

  @Prop()
  readonly posts!: string[] | null;

  @Prop()
  readonly reviews!: string[] | null;
}