import { Connection } from "mongoose";
import * as request from "supertest";
import { AppModule } from "../../../../../../../apps/api/src/app/app.module";
//import { AppModule } from "@encompass/api/app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseService } from "../../../../../../../apps/api/src/dbTest/database.service";
//import { DatabaseService } from "@encompass/api/dbTest/data-access";
import { commentStub } from "../stubs/comment.stub";
import { commentDtoStub } from "../stubs/comment.dto.stub";



describe('CommentController', () => {
    let dbConnection: Connection;
    let httpServer: any;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        const app = moduleRef.createNestApplication();
        await app.init();
        dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
        console.log(dbConnection.name);
        httpServer = app.getHttpServer();
    });

    describe('createComment', () => {
        it('should create and return the same Comment', async () => {
            const { _id, ...temp } = commentStub();
            const CommentStubWithStringId = {
                _id: _id.toString(),
                ...temp
            };

            const response = await request(httpServer)
                .post(`/comment/create`)
                .send(temp);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(temp);
        }); 
    });

    /*describe('getComment', () => {
        it('should return the Comment inserted', async () => {
            const { _id, ...temp } = commentStub();
            const CommentStubWithStringId = {
                _id: _id.toString(),
                ...temp
            };

            await dbConnection.collection('Comment').insertOne(commentStub());
            const response = await request(httpServer).get(`/comment/${commentStub()._id.toString()}`);
            expect(response.status).toBe(200);

            expect(response.body).toMatchObject(CommentStubWithStringId);
        });
        
    });

    describe('updateComment', () => {
        it('should return the updated profiile', async () => {
            const { _id, ...temp } = CommentStubTwo();
            const CommentStubWithStringId = {
                _id: _id.toString(),
                ...temp
            };

            await dbConnection.collection('Comment').insertOne(CommentStub());
            const response = await request(httpServer)
                .patch(`/Comment/${_id}`)
                .send(temp);

            expect(response.status).toBe(200);
            expect(response.body).not.toMatchObject(CommentStub());
            expect(response.body).toMatchObject(CommentStubWithStringId);
        }); 
    });

    describe('getCommentByUsername', () => {
        it('should return true when Comment is found', async () => {
            await dbConnection.collection('Comment').insertOne(CommentStub());
            const response = await request(httpServer).get(`/Comment/user/${CommentStub().username}`);
            
            expect(response.status).toBe(200);
            expect(response.text).toBe('true');
        });
        
    });*/

    afterEach(async () => {
        await dbConnection.collection('comment').deleteMany({});
    });

    afterAll(async () => {
        await dbConnection.close();
    })
});

