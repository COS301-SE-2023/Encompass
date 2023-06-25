import { Connection } from "mongoose";
import * as request from "supertest";
import { AppModule } from '../../../../../../../apps/api/src/app/app.module';
import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseService } from "../../dbTest/database.service";
import { profileStub } from "../stubs/profile.stub";

describe('profileController', () => {
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

    describe('getProfile', () => {
        it('should return a profile', async () => {
            await dbConnection.collection('profile').insertOne(profileStub());
            const response = await request(httpServer).get('/profile/6496e5e9571ba68130d6e1cd');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(profileStub());
        });
        
    });

    afterAll(async () => {
        await dbConnection.collection('profile').deleteMany({});
        await dbConnection.close();
    });
});

