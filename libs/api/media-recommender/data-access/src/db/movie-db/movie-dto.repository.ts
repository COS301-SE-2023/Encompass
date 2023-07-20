import { Inject, Injectable } from "@nestjs/common";

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