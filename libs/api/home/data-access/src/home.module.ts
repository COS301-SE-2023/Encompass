import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { HomeController } from "./home.controller";
import { HomeEntityRepository } from "./db/home-entity.repository";
import { HomeSchemaFactory } from "./db/home-schema.factory";
import { MongooseModule, SchemaFactory } from "@nestjs/mongoose";
import { HomeSchema } from "./db/home.schema";
import { HomeQueryHandlers } from "./queries";
import { HomeDtoRepository } from "./db/home-dto.repository";
@Module({
  imports: [CqrsModule,
  MongooseModule.forFeature([
    {
      name: HomeSchema.name,
      schema: SchemaFactory.createForClass(HomeSchema)
    }
  ])
],
  controllers: [HomeController],
  providers: [
    HomeEntityRepository,
    HomeSchemaFactory,
    HomeDtoRepository,
    ...HomeQueryHandlers
  ]
})
export class HomeModule {

}