import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { BookSchema } from "./book.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book } from "../book";
import { BookSchemaFactory } from "./book-schema.factory";
import { BookDto } from "../book.dto";

@Injectable()
export class BookEntityRepository extends BaseEntityRepository<BookSchema, Book>{
    private readonly bookModel: Model<BookSchema>;

    constructor(
        @InjectModel(BookSchema.name)
        bookModel: Model<BookSchema>,
        bookSchemaFactory: BookSchemaFactory,
    ) {
        super(bookModel, bookSchemaFactory);
        this.bookModel = bookModel;
    }

    async findSome(categories: string[]): Promise<BookDto[]> {
        //choose random 200 books where 

        return await this.bookModel.aggregate([{ $match: { language: 'English', genres: { $regex: categories.join('|') } } }, { $sample: { size: 200 } }]);
    }
} 