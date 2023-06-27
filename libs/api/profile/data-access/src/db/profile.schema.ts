import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: "profile" })
export class ProfileSchema extends IdentifiableEntitySchema{
  @Prop()
  readonly username!: string;

  @Prop({ type: String})
  readonly name!: string | null;

  @Prop( { type: String } )
  readonly lastName!: string | null;

  @Prop( { type: [String] } )
  readonly categories!: string[] | null;

  @Prop( { type: [String] } )
  readonly communities!: string[] | null;
  
  @Prop( { type: [String] } )
  readonly awards!: string[] | null;

  @Prop( { type: [String] } )
  readonly events!: string[] | null;

  @Prop( { type: [String] } )
  readonly followers!: string[] | null;

  @Prop( { type: [String] } )
  readonly following!: string[] | null;

  @Prop( { type: [String] } )
  readonly posts!: string[] | null;

  @Prop( { type: [String] } )
  readonly reviews!: string[] | null;

  @Prop()
  readonly profileImage!: string | null;

  @Prop()
  readonly bio!: string | null;
}