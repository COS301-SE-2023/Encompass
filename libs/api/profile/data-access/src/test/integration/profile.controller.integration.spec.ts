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
        console.log(dbConnection.name);
        httpServer = app.getHttpServer();
    });

    describe('getProfile', () => {
        it('should return the profile inserted', async () => {
            const { _id, ...temp } = profileStub();
            const profileStubWithStringId = {
                _id: _id.toString(),
                ...temp
            };

            await dbConnection.collection('profile').insertOne(profileStub());
            const response = await request(httpServer).get(`/profile/${profileStub()._id.toString()}`);
            expect(response.status).toBe(200);

            expect(response.body).toMatchObject(profileStubWithStringId);
            expect(true).toBe(true);
        });
        
    });

    afterAll(async () => {
        await dbConnection.collection('profile').deleteMany({});
        await dbConnection.close();
    });
});

