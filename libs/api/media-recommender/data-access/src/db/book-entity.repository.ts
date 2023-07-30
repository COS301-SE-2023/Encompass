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

    async findAllCategories(): Promise<string[]> {
        // get all genres from the database where an example genre might be "genres": "['Young Adult', 'Fiction', 'Dystopia', 'Fantasy']" , 
        // then split the string to get an array of strings like ['Young Adult', 'Fiction', 'Dystopia', 'Fantasy']
        // then flatten the array to get ['Young Adult', 'Fiction', 'Dystopia', 'Fantasy']
        // then remove duplicates to get ['Young Adult', 'Fiction', 'Dystopia', 'Fantasy']
        //the books must have language = 'English' 
        // then return the array
        return await this.bookModel.distinct('genres').then((genres) => {
            return genres.map((genre) => {
                return genre.split(',').map((g) => {
                    //remove the square brackets and the single quotes
                    g = g.replace('[', '').replace(']', '').replace(/'/g, '');
                    return g.trim();
                });
            }).flat().filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
        });
    }

    async findSome(categories: string[]): Promise<BookDto[]> {
        

        return await this.bookModel.aggregate([{ $match: { language: 'English', genres: { $regex: categories.join('|') } } }, { $sample: { size: 200 } }]);
    }
} 