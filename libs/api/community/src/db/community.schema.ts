import { Schema, Prop } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";

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