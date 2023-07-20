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

    async findSome(): Promise<MovieDto[]> {
        //choose random 200 movies 
        return await this.movieModel.aggregate([{ $sample: { size: 200 } }]);
    }

    async findById(id: string){
        return await this.movieModel.findById({ _id: id });
    }
}