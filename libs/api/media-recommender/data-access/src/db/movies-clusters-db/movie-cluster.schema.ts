import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: 'Movie_Clusters' })
export class MovieClusterSchema extends IdentifiableEntitySchema {
    @Prop()
    readonly MovieIds!: string[];

    @Prop()
    readonly MovieCategories!: string[];
}
