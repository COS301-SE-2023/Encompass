import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: 'Books-sample-2' })
export class BookSchema extends IdentifiableEntitySchema{
    @Prop()
    readonly bookId!: string;

    @Prop()
    readonly title!: string;

    @Prop()
    readonly series!: string;

    @Prop()
    readonly author!: string;

    @Prop()
    readonly rating!: number;

    @Prop()
    readonly description!: string;

    @Prop()
    readonly language!: string;

    @Prop()
    readonly isbn!: string;

    @Prop({ type: String })
    readonly genres!: string;

    @Prop({ type: [String] })
    readonly characters!: string[];

    @Prop()
    readonly bookFormat!: string;

    @Prop()
    readonly edition!: string;

    @Prop()
    readonly pages!: number;

    @Prop()
    readonly publisher!: string;

    @Prop()
    readonly publishDate!: string;

    @Prop({ type: [String] })
    readonly awards!: string[];

    @Prop()
    readonly numRatings!: number;

    @Prop({ type: [String] })
    readonly ratingsByStars!: string[];

    @Prop()
    readonly likedPercent!: number;

    @Prop({ type: [String] })
    readonly setting!: string[];

    @Prop()
    readonly coverImg!: string;

    @Prop()
    readonly bbeScore!: number;

    @Prop()
    readonly bbeVotes!: number;

    @Prop()
    readonly price!: number;
}