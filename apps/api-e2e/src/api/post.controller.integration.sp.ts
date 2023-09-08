/*import mongoose, { Connection, Schema } from "mongoose";
import { INestApplication } from '@nestjs/common';
import request from "supertest";
import { AppModule } from "./app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { postStub } from "./stubs/post.stub";
import { MongooseModule } from "@nestjs/mongoose";
import { PostDtoStub } from "./stubs/post.dto.stub";

export interface Post extends Document {
    community: string;
    title: string;
    text: string;
    username: string;
    imageUrl: string | null;
    communityImageUrl: string | null;
    categories: string [];
    likes: string [];
    dateAdded: string;
    spoiler: boolean;
    ageRestricted: boolean;
    shares: number;
    comments: number;
    reported: boolean;
    isPrivate: boolean;
}


export const PostSchema = new Schema<Post>({
    community: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    username: { type: String, required: true },
    imageUrl: { type: String, required: false },
    communityImageUrl: { type: String, required: false },
    categories: { type: [String], required: true },
    likes: { type: [String], required: true },
    dateAdded: { type: String, required: true },
    spoiler: { type: Boolean, required: true },
    ageRestricted: { type: Boolean, required: true },
    shares: { type: Number, required: true },
    comments: { type: Number, required: true },
    reported: { type: Boolean, required: true },
    isPrivate: { type: Boolean, required: true }
});

const dbUrl = process.env['NX_MONGO_DB_TEST'];

const connectToDatabase = async () => {
    try {
        // Connect to the MongoDB database
        await mongoose.connect(dbUrl);

        console.log('Connected to the database!');

        // Get the Mongoose connection
        const dbConnection = mongoose.connection;

        // Optional: You can add event listeners to handle connection events
        dbConnection.on('error', (error) => {
            console.error('Database connection error:', error);
        });

        dbConnection.once('open', () => {
            console.log('Database connected!');
        });

        dbConnection.on('disconnected', () => {
            console.log('Disconnected from the database');
        });

        // Return the Mongoose connection so you can use it in other parts of your application
        return dbConnection;
    } catch (error) {
        console.error('Could not connect to database!', error);
    }
};

describe('PostController', () => {
    let dbConnection: Connection;
    let app: INestApplication;

    const setupTestApp = async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule,
            MongooseModule.forFeature([{ name: 'post', schema: PostSchema }])],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        dbConnection = await connectToDatabase();
    };

    beforeAll(async () => {
        await setupTestApp();
        //console.log("PAGE IS SETUP!!!!!!!!");
    });

    describe('createPost', () => {
        it('should create and return the same Post', async () => {
            const { _id, ...temp } = postStub();
            console.log("TEMP!!!!!!!");
            console.log(temp);

            const response = await request(app.getHttpServer())
                .post(`/post/create`)
                .send(temp);

            console.log("response.status");
            console.log(response.status);
            console.log("response.body");
            console.log(response.body);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(temp);
        }); 
    });

    describe('updatePost', () => {
        it('should delete inserted Post and return id of deleted Post', async () => {
            const { _id } = PostDtoStub();

            await dbConnection.collection('post').insertOne(PostDtoStub());
            const response = await request(app.getHttpServer()).delete(`/post/delete/${_id.toString()}`);

            console.log("response.status");
            //console.log(response.status);
            console.log("response.body");
            //console.log(response.body);


            expect(response.status).toBe(200);
            expect(response.text).toBe(_id.toString());
        });
        
    });

    describe('deletePost', () => {
        it('should delete inserted Post and return id of deleted Post', async () => {
            const { _id } = PostDtoStub();

            await dbConnection.collection('Post').insertOne(PostDtoStub());
            const response = await request(app.getHttpServer()).delete(`/post/delete/${_id.toString()}`);
            expect(response.status).toBe(200);

            expect(response.text).toBe(_id.toString());
        });
        
    });

    /*describe('addReply', () => {
        it('should return Post with added reply', async () => {
            const { _id } = PostDtoStub();

            await dbConnection.collection('post').insertOne(PostDtoStub());
            const response = await request(app.getHttpServer())
                .patch(`/post/add-reply/${_id.toString()}`)
                .send(replyStub());

            expect(response.status).toBe(200);
            expect(response.body).not.toEqual(PostDtoStub());
            expect(response.body.replies[0]).toMatchObject(replyStub());
        }); 
    });

    describe('deleteReply', () => {
        it('should return true when Post is found', async () => {
            const replyId = PostWithReplyStub().replies[0].id;
            const PostId = PostWithReplyStub()._id;

            await dbConnection.collection('post').insertOne(PostWithReplyStub());
            const response = await request(app.getHttpServer())
                .delete(`/post/delete-reply/${PostId}/${replyId}`);
            
            expect(response.status).toBe(200);
            expect(response.text).toBe(replyId);
        });
        
    });
    
    describe('getPostPosts', () => {
        it('should return the Post inserted', async () => {
            await dbConnection.collection('Post').insertOne(PostWithReplyStub());
            const response = await request(app.getHttpServer()).get(`/Post/get-post-Posts/${PostWithReplyStub()._id.toString()}`);
            expect(response.status).toBe(200);
            console.log(response);
            //expect(response.body).toMatchObject(C);
        });
        
    });

    afterEach(async () => {
        await dbConnection.collection('Post').deleteMany({});
    });

    afterAll(async () => {
        await dbConnection.close();
    })
});*/