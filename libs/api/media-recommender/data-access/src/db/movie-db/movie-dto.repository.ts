import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MovieSchema } from "./movie.schema";
import { Model } from "mongoose";

@Injectable()
export class MovieDtoRepository{
    constructor(
        @InjectModel(MovieSchema.name)
        private readonly movieModel: Model<MovieSchema>,
    ) {}

    async findAll(): Promise<MovieSchema[]> {
        return await this.movieModel.find();
    }

    async findSome(): Promise<MovieSchema[]> {
        //choose random 1024 movies 
        return await this.movieModel.aggregate([{ $sample: { size: 1024 } }]);
    }

    async findById(id: string){
        return await this.movieModel.findById({ _id: id });
    }
}