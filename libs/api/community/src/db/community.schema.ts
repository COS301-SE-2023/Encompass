import { Schema, Prop } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from "../../../database/data-access/src";

@Schema({ versionKey: false, collection: 'community' })
export class CommunitySchema extends IdentifiableEntitySchema {
    @Prop()
    readonly name!: string;

    @Prop()
    readonly admin!: string;

    @Prop()
    readonly about!: string;

    @Prop()
    readonly members!: string[];

    @Prop()
    readonly events!: string[];

    @Prop()
    readonly posts!: string[];
}