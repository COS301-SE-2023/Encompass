import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { HomeController } from "./home.controller";
import { HomeEntityRepository } from "./home-entity.repository";
import { HomeSchemaFactory } from "./home-schema.factory";
import { MongooseModule, SchemaFactory } from "@nestjs/mongoose";
import { HomeSchema } from "./home.schema";

@Module({
  imports: [CqrsModule,
  MongooseModule.forFeature([
    {
      name: HomeSchema.name,
      schema: SchemaFactory.createForClass(HomeSchema)
    }
  ])],
  controllers: [HomeController],
  providers: [
    HomeEntityRepository,
    HomeSchemaFactory,
  ]
})
export class HomeModule {

}