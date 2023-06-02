import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CommunitySchema } from "./community.schema";
import { Model } from "mongoose";
import { CommunityDto } from "../community.dto";
import { Community } from "../community";

@Injectable()
export class CommunityDtoRepository {
    constructor(
        @InjectModel(CommunitySchema.name)
        private readonly communityModel: Model<CommunitySchema>,
    ) {}

    /*async create(communityDto: CommunityDto): Promise<Community> {
        const community = new this.communityModel(communityDto);
        return community.save();
    }

    async findOneById(id: string): Promise<Community> {
        return this.communityModel.findById(id).exec();
    }*/

    async findAll(): Promise<CommunityDto[]> {
        return await this.communityModel.find();
    }
}