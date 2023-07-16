import { Injectable } from "@nestjs/common";
import { BookSchema } from "./book.schema";
import { Book } from "../book";
import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { ObjectId } from "mongodb";

@Injectable()
export class BookSchemaFactory implements EntitySchemaFactory<BookSchema, Book> {
    create(book: Book): BookSchema {
        return {
            _id: new ObjectId(book.getId()),
            bookId: book.getId(),
            title: book.getTitle(),
            series: book.getSeries(),
            author: book.getAuthor(),
            rating: book.getRating(),
            description: book.getDescription(),
            language: book.getLanguage(),
            isbn: book.getIsbn(),
            genres: book.getGenres(),
            characters: book.getCharacters(),
            bookFormat: book.getBookFormat(),
            edition: book.getEdition(),
            pages: book.getPages(),
            publisher: book.getPublisher(),
            publishDate: book.getPublishDate(),
            awards: book.getAwards(),
            numRatings: book.getNumRatings(),
            ratingsByStars: book.getRatingsByStars(),
            likedPercent: book.getLikedPercent(),
            setting: book.getSetting(),
            coverImg: book.getCoverImg(),
            bbeScore: book.getBbeScore(),
            bbeVotes: book.getBbeVotes(),
            price: book.getPrice()
        };
    }

    createFromSchema(entitySchema: BookSchema): Book {
        return new Book(
            entitySchema._id.toHexString(),
            entitySchema.bookId,
            entitySchema.title,
            entitySchema.series,
            entitySchema.author,
            entitySchema.rating,
            entitySchema.description,
            entitySchema.language,
            entitySchema.isbn,
            entitySchema.genres,
            entitySchema.characters,
            entitySchema.bookFormat,
            entitySchema.edition,
            entitySchema.pages,
            entitySchema.publisher,
            entitySchema.publishDate,
            entitySchema.awards,
            entitySchema.numRatings,
            entitySchema.ratingsByStars,
            entitySchema.likedPercent,
            entitySchema.setting,
            entitySchema.coverImg,
            entitySchema.bbeScore,
            entitySchema.bbeVotes,
            entitySchema.price
        )
      }
}