import { Injectable } from "@nestjs/common";
import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { InjectModel } from "@nestjs/mongoose";
import { HomeSchema } from "./home.schema";
import { Home } from "../home";
import { HomeSchemaFactory } from "./home-schema.factory";
import { Model } from "mongoose";

@Injectable()
export class HomeEntityRepository extends BaseEntityRepository<
HomeSchema, 
Home
> {
  constructor(
    @InjectModel(HomeSchema.name)
    homeModel: Model<HomeSchema>,
    homeSchemaFactory: HomeSchemaFactory
  ) {
    super(homeModel, homeSchemaFactory);
  }
}