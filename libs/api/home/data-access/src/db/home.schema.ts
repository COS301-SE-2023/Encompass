import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '@encompass/api/database/data-access';

@Schema({ versionKey: false, collection: 'home' })
export class HomeSchema extends IdentifiableEntitySchema {
  @Prop({ type: String, required: false })
  readonly name: string | undefined;
}