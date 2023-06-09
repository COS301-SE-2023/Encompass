import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema,} from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: 'community' })
export class CommunitySchema extends IdentifiableEntitySchema {
    //what about _id????
    @Prop()
    readonly name!: string;

    @Prop()
    readonly admin!: string;
    
    @Prop()
    readonly about!: string;
    
    @Prop()
    readonly events!: string[];
    
    @Prop()
    readonly posts!: string[];
    
    @Prop()
    readonly members!: string[];
}