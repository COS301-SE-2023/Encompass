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
        //choose random 200 movies where all have Original_Language = 'en' and they have at least one of the categories exist in the Genre string 
        return await this.movieModel.aggregate([{ $match: { Original_Language: 'en', Genre: { $regex: categories.join('|') } } }, { $sample: { size: 200 } }]);

        //return await this.movieModel.aggregate([{ $sample: { size: 200 } }]);
    }

    async findById(id: string){
        return await this.movieModel.findById({ _id: id });
    }
}