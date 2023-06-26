import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Schema, Prop } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: "post" })
export class PostSchema extends IdentifiableEntitySchema{
  @Prop()
  readonly community!: string;

  @Prop()
  readonly title!: string;

  @Prop()
  readonly text!: string;

  @Prop()
  readonly username!: string;

  @Prop( { type: String } )
  readonly imageUrl!: string | null;

  @Prop( { type: [String] } )
  readonly communityImageUrl!: string | null;

  @Prop() 
  readonly categories!: string[];

  @Prop( { type: [String] } )
  readonly likes!: string[];

  @Prop( { type: String } )
  readonly dateAdded!: string;

  @Prop( { type: Boolean } )
  readonly spoiler!: boolean;

  @Prop( { type: Boolean } )
  readonly ageRestricted!: boolean;

  @Prop()
  readonly shares!: number;

  @Prop()
  readonly comments!: number;

  @Prop()
  readonly reported!: boolean;
}