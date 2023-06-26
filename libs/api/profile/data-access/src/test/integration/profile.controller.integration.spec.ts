import { Connection } from "mongoose";
import * as request from "supertest";
import { AppModule } from "../../../../../../../apps/api/src/app/app.module";
//import { AppModule } from "@encompass/api/app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseService } from "../../../../../../../apps/api/src/dbTest/database.service";
//import { DatabaseService } from "@encompass/api/dbTest/data-access";
import { profileStub } from "../stubs/profile.stub";
import { profileStubTwo } from "../stubs/profile.stubTwo";

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

    describe('createProfile', () => {
        it('should return the profile inserted', async () => {
            const { _id, ...temp } = profileStub();
            const profileStubWithStringId = {
                _id: _id.toString(),
                ...temp
            };

            const response = await request(httpServer)
                .post(`/profile/create`)
                .send(profileStub());

            console.log(response.body);
            expect(response.status).toBe(201);

            expect(response.body).toMatchObject(profileStubWithStringId);
        }); 
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
        });
        
    });

    describe('updateProfile', () => {
        it('should return the updated profiile', async () => {
            const { _id, ...temp } = profileStubTwo();
            const profileStubWithStringId = {
                _id: _id.toString(),
                ...temp
            };

            await dbConnection.collection('profile').insertOne(profileStub());
            const response = await request(httpServer)
                .patch(`/profile/${_id}`)
                .send(temp);

            expect(response.status).toBe(200);
            expect(response.body).not.toMatchObject(profileStub());
            expect(response.body).toMatchObject(profileStubWithStringId);
        }); 
    });

    afterEach(async () => {
        await dbConnection.collection('profile').deleteMany({});
    });

    afterAll(async () => {
        await dbConnection.close();
    })
});

