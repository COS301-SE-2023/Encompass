import mongoose, { Connection } from "mongoose";
import * as request from "supertest";
import { AppModule } from "../../../../../../../apps/api/src/app/app.module";
//import { AppModule } from "@encompass/api/app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseService } from "../../../../../../../apps/api/src/dbTest/database.service";
//import { DatabaseService } from "@encompass/api/dbTest/data-access";
import { postStub } from "../stubs/Post.stub";

describe('PostController', () => {
    let dbConnection: Connection;
    let httpServer: any;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        const app = moduleRef.createNestApplication();
        await app.init();
        dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
        httpServer = app.getHttpServer();
    });

    describe('createPost', () => {
        it('should create and return the same Post', async () => {
            const { _id, ...temp } = postStub();

            const response = await request(httpServer)
                .post(`/post/create`)
                .send(temp);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(temp);
        }); 
    });

    /*describe('updatePost', () => {
        it('should delete inserted Post and return id of deleted Post', async () => {
            const { _id } = PostDtoStub();

            await dbConnection.collection('Post').insertOne(PostDtoStub());
            const response = await request(httpServer).delete(`/post/delete/${_id.toString()}`);
            expect(response.status).toBe(200);

            expect(response.text).toBe(_id.toString());
        });
        
    });

    describe('deletePost', () => {
        it('should delete inserted Post and return id of deleted Post', async () => {
            const { _id } = PostDtoStub();

            await dbConnection.collection('Post').insertOne(PostDtoStub());
            const response = await request(httpServer).delete(`/post/delete/${_id.toString()}`);
            expect(response.status).toBe(200);

            expect(response.text).toBe(_id.toString());
        });
        
    });

    describe('addReply', () => {
        it('should return Post with added reply', async () => {
            const { _id } = PostDtoStub();

            await dbConnection.collection('post').insertOne(PostDtoStub());
            const response = await request(httpServer)
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
            const response = await request(httpServer)
                .delete(`/post/delete-reply/${PostId}/${replyId}`);
            
            expect(response.status).toBe(200);
            expect(response.text).toBe(replyId);
        });
        
    });
    
    describe('getPostPosts', () => {
        it('should return the Post inserted', async () => {
            await dbConnection.collection('Post').insertOne(PostWithReplyStub());
            const response = await request(httpServer).get(`/Post/get-post-Posts/${PostWithReplyStub()._id.toString()}`);
            expect(response.status).toBe(200);
            console.log(response);
            //expect(response.body).toMatchObject(C);
        });
        
    });*/

    afterEach(async () => {
        await dbConnection.collection('Post').deleteMany({});
    });

    afterAll(async () => {
        await dbConnection.close();
    })
});

