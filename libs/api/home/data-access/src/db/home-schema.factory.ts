import { Injectable } from "@nestjs/common";
import { EntitySchemaFactory } from "../database/entity-schema.factory";
import { Home } from "../home";
import { HomeSchema } from "./home.schema";
import { ObjectId } from "mongodb";

@Injectable()
export class HomeSchemaFactory implements EntitySchemaFactory<HomeSchema, Home>{
    create(entity: Home): HomeSchema {
      return {
        _id: new ObjectId(entity.getId()),
        name: entity.getName()
      }
    }

    createFromSchema(entitySchema: HomeSchema): Home {
      return new Home(
        entitySchema._id?.toHexString(),
        entitySchema.name
        );
    }
  }