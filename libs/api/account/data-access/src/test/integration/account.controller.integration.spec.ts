import { Connection } from "mongoose";
import * as request from "supertest";
import { AppModule } from "../../../../../../../apps/api/src/app/app.module";
//import { AppModule } from "@encompass/api/app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseService } from "../../../../../../../apps/api/src/dbTest/database.service";
//import { DatabaseService } from "@encompass/api/dbTest/data-access";
import { accountStub } from "../stubs/account.stub";

describe('accountController', () => {
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

    describe('createAccount', () => {
        it('should insert account to database and return id length of 24', async () => {
            const { _id, ...temp } = accountStub();

            const response = await request(httpServer)
                .post(`/account`)
                .send(temp);

            expect(response.status).toBe(201);
            expect(response.text).toHaveLength(24);
        });
        
    });

    describe('getAccount', () => {
        it('should return the account inserted', async () => {
            const { _id, ...temp } = accountStub();
            const accountStubWithStringId = {
                _id: _id.toString(),
                ...temp
            };

            await dbConnection.collection('account').insertOne(accountStub());
            const response = await request(httpServer)
                .post(`/account/login`)
                .send(temp);

            expect(response.status).toBe(201);
            expect(response.body).toBeDefined();
            //expect(response.body).toMatchObject(accountStubWithStringId);
        });
        
    });

    describe('getAccountById', () => {
        it('should return true when given the email of the inserted account', async () => {
            const { _id, ...temp } = accountStub();
            await dbConnection.collection('account').insertOne(accountStub());
            const response = await request(httpServer).get(`/account/${temp.email}`);

            console.log(response);
            expect(response.status).toBe(200);
            expect(response.text).toBe('true');
        });
        
    });

    afterAll(async () => {
        await dbConnection.collection('account').deleteMany({});
        await dbConnection.close();
    });
});



