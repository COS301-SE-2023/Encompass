import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class PodcastDtoRepository {
    constructor(
        @InjectModel(PodcastSchema.name)
        private readonly podcastModel: Model<PodcastSchema>,
    ) {}

    async findAll(): Promise<PodcastSchema[]> {
        return await this.podcastModel.find();
    }

    async findSome(): Promise<PodcastSchema[]> {
        //choose random 1024 podcasts
        return await this.podcastModel.aggregate([{ $sample: { size: 1024 } }]);
    }

    async findById(id: string){
        return await this.podcastModel.findById({ _id: id });
    }
}