import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema,} from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: 'community' })
export class CommunitySchema extends IdentifiableEntitySchema {
    @Prop()
    readonly name!: string;

    @Prop()
    readonly type!: string;

    @Prop()
    readonly admin!: string;
    
    @Prop()
    readonly about!: string;

    @Prop()
    readonly rules!: string;

    @Prop()
    readonly groupImage!: string;

    @Prop()
    readonly categories!: string[];
    
    @Prop()
    readonly events!: string[];
    
    @Prop()
    readonly posts!: string[];
    
    @Prop()
    readonly members!: string[];

    @Prop()
    readonly ageRestricted!: boolean;

    @Prop()
    readonly createdAt!: Date;
}