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
        it('should insert account to database and return id', async () => {
            const { _id, ...temp } = accountStub();
            const accountStubWithStringId = {
                _id: _id.toString(),
                ...temp
            };

            const response = await request(httpServer)
                .post(`/account`)
                .send(temp);

            //console.log(response);
            expect(response.status).toBe(201);
            
            //expect(response.body).toHaveLength(24);
            //expect(response.body).toMatchObject(accountStubWithStringId);
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

            //console.log(response);
            expect(response.status).toBe(201);
            
            expect(response.body).toBeDefined();
            console.log(response.header);
            console.log(response.body);
            //expect(response.body).toMatchObject(accountStubWithStringId);
        });
        
    });

    describe('getAccountById', () => {
        it('should ', async () => {
            const { _id, ...temp } = accountStub();
            await dbConnection.collection('account').insertOne(accountStub());
            const response = await request(httpServer).get(`/account/${temp.email}`);

            expect(response.status).toBe(200);
        });
        
    });

    afterAll(async () => {
        await dbConnection.collection('account').deleteMany({});
        await dbConnection.close();
    });
});



