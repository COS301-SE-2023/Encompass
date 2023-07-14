import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { BookSchema } from "./book.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book } from "../book";
import { BookSchemaFactory } from "./book-schema.factory";

@Injectable()
export class BookEntityRepository extends BaseEntityRepository<BookSchema, Book>{
    constructor(
        @InjectModel(BookSchema.name)
        bookModel: Model<BookSchema>,
        bookSchemaFactory: BookSchemaFactory,
    ) {
        super(bookModel, bookSchemaFactory);
    }
} 