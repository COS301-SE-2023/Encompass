import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MovieSchema } from "./movie.schema";
import { Model } from "mongoose";
import { MovieDto } from "../../movie.dto";

@Injectable()
export class MovieDtoRepository{
    constructor(
        @InjectModel(MovieSchema.name)
        private readonly movieModel: Model<MovieSchema>,
    ) {}

    async findAll(): Promise<MovieSchema[]> {
        return await this.movieModel.find();
    }

    async findSome(categories: string[]): Promise<MovieDto[]> {
        // Choose random 200 movies where all have Original_Language = 'en'
        // and they have at least one of the categories exist in the Genre string
        return await this.movieModel.aggregate([
          {
            $match: {
              Original_Language: 'en',
              Genre: { $regex: categories.join('|'), $not: /Romance/ } // Exclude movies with the "Romance" genre
            }
          },
          {
            $sample: { size: 200 }
          }
        ]);
    }
      
      

    async findById(id: string){
        return await this.movieModel.findById({ _id: id });
    }

    async findAllCategories(): Promise<string[]> {
        const result = await this.movieModel.aggregate([
          {
            $project: {
              Genre: { $split: ["$Genre", ", "] } // Split the Genre string by comma and space
            }
          },
          {
            $unwind: "$Genre" // Unwind the array to create separate documents for each genre
          },
          {
            $group: {
              _id: "$Genre" // Group by genre to get distinct values
            }
          },
          {
            $project: {
              _id: 0, // Exclude the _id field
              Genre: "$_id" // Rename _id to Genre
            }
          }
        ]).exec();
      
        // Extract the distinct genres from the result
        const genres = result.map((item: { Genre: string }) => item.Genre);
      
        return genres;
      }
      
      
}