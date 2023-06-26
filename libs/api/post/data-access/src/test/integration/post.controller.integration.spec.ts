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

    

    afterEach(async () => {
        await dbConnection.collection('Post').deleteMany({});
    });

    afterAll(async () => {
        await dbConnection.close();
    })
});

