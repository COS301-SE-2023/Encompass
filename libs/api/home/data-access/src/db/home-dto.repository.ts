import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { HomeSchema } from "./home.schema";
import { Model } from "mongoose";
import { HomeDto } from "../home.dto";

@Injectable()
export class HomeDtoRepository{
  constructor(
    @InjectModel(HomeSchema.name)
    private readonly homeModel: Model<HomeSchema>,
  ){}

  async findAll(): Promise<HomeDto[]>{
    return await this.homeModel.find();
   
  }
}