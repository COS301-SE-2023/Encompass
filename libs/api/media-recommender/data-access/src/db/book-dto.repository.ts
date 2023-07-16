import { Injectable } from "@nestjs/common";
import { BookSchema } from "./book.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class BookDtoRepository{
    constructor(
        @InjectModel(BookSchema.name)
        private readonly bookModel: Model<BookSchema>,
    ) {}

    async findAll(): Promise<BookSchema[]> {
        return await this.bookModel.find();
    }

    async findSome(): Promise<BookSchema[]> {
        //choose random 1024 books 
        return await this.bookModel.aggregate([{ $sample: { size: 560 } }]);
    }

    async findById(id: string){
        return await this.bookModel.findById({ _id: id });
    }
}