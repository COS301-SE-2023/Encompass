import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { PodcastSchema } from "./podcast-schema";
import { Podcast } from "../../podcast";
import { ObjectId } from "mongodb";

@Injectable()
export class PodcastSchemaFactory implements EntitySchemaFactory<PodcastSchema, Podcast> {
    create(podcast: Podcast): PodcastSchema {
        return {
            _id: new ObjectId(podcast.getId()),
            title: podcast.getTitle(),
            image: podcast.getImage(),
            description: podcast.getDescription(),
            language: podcast.getLanguage(),
            categories: podcast.getCategories(),
            author: podcast.getAuthor(),
            website: podcast.getWebsite(),
        };
    }

    createFromSchema(entitySchema: PodcastSchema): Podcast {
        return new Podcast(
            entitySchema._id.toHexString(),
            entitySchema.title,
            entitySchema.image,
            entitySchema.description,
            entitySchema.language,
            entitySchema.categories,
            entitySchema.author,
            entitySchema.website,
        );
    }
