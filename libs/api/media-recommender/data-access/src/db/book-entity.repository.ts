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

    async findSome(): Promise<BookDto[]> {
        //choose random 200 books 
        return await this.bookModel.aggregate([{ $sample: { size: 200 } }]);
    }
} 