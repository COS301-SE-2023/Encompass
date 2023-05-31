import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '../database/identifiable-entity.schema';

@Schema({ versionKey: false, collection: 'home' })
export class HomeSchema extends IdentifiableEntitySchema {
  @Prop()
  readonly name: string | undefined;
}