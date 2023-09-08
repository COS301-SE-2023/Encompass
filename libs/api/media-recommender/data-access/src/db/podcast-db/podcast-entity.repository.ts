import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { PodcastSchema } from "./podcast-schema";
import { Podcast } from "../../podcast";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PodcastSchemaFactory } from "./podcast-schema.factory";

@Injectable()
export class PodcastEntityRepository extends BaseEntityRepository<PodcastSchema, Podcast>{
    private readonly podcastModel: Model<PodcastSchema>;

    constructor(
        @InjectModel(PodcastSchema.name)
        podcastModel: Model<PodcastSchema>,
        podcastSchemaFactory: PodcastSchemaFactory,
    ) {
        super(podcastModel, podcastSchemaFactory);
        this.podcastModel = podcastModel;
    }

    async findSome(categories: string[]): Promise<Podcast[]> {
        return await this.podcastModel.aggregate([{ $match: { language: 'English', categories: { $regex: categories.join('|') } } }, { $sample: { size: 2 } }]);
    }

    async findAllCategories(): Promise<string[]> {
        return await this.podcastModel.aggregate([
            {
              $project: {
                categories: { $split: ["$categories", " | "] } // Split the categories string into an array
              }
            },
            {
              $unwind: "$categories" // Unwind the array to create separate documents for each category
            },
            {
              $group: {
                _id: "$categories" // Group by category to get distinct values
              }
            },
            {
              $project: {
                _id: 0, // Exclude the _id field
                category: "$_id" // Rename _id to category
              }
            }
          ]);
    }
          
}