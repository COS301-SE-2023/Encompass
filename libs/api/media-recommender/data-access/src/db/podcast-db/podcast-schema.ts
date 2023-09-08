import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: 'Podcasts' })
export class PodcastSchema extends IdentifiableEntitySchema{
    @Prop()
    readonly title!: string;

    @Prop()
    readonly image!: string;

    @Prop()
    readonly description!: string;

    @Prop()
    readonly language!: string;

    @Prop()
    readonly categories!: string;

    @Prop()
    readonly author!: string;

    @Prop()
    readonly website!: string;
}
