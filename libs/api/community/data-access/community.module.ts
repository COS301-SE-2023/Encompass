import { CommunitySchemaFactory } from "./db/community-schema.factory";
import { CommunityFactory } from "./community.factory";
import { CreateCommunityHandler, UpdateCommunityHandler } from "./commands";
import { CommunityCreatedHandler } from "./events";
import { GetCommunityHandler, GetUsernameHandler } from "./queries";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: CommunitySchema.name,
        schema: SchemaFactory.createForClass(CommunitySchema),
      },
    ]),
  ],

  controllers: [CommunityController],
  providers: [
    CommunityEntityRepository,
    CommunityDtoRepository,
    CommunitySchemaFactory,
    CommunityFactory,
    CreateCommunityHandler,
    CommunityCreatedHandler,
    GetCommunityHandler,
    //UpdateCommunityHandler,
    GetUsernameHandler
  ],
})

export class CommunityModule{}