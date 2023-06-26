import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CommunitySchema } from "./community.schema";
import { CommunityDto } from "../community.dto";
import { Model } from "mongoose";

@Injectable()
export class CommunityDtoRepository {
    constructor(
        @InjectModel(CommunitySchema.name)
        private readonly communityModel: Model<CommunitySchema>,
    ) {}

    async findAll(): Promise<CommunityDto[]> {
        return await this.communityModel.find();
    }

    async findById(id: string){
        return await this.communityModel.findOne({ _id: id });
    }

    async getByName(name: string){
        return await this.communityModel.findOne({ name: name });
    }
}