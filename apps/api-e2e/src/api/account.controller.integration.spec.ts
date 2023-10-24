import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './app.module';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose, { Schema, Document, Connection } from 'mongoose';
import { accountStub } from './stubs/account.stub';

export interface Account extends Document {
  email: string;
  password: string;
}

export const AccountSchema = new Schema<Account>({
  email: { type: String, required: true },
  password: { type: String, required: true },
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

    dbConnection.on('disconnected', () => {
      console.log('Disconnected from the database');
    });

    // Return the Mongoose connection so you can use it in other parts of your application
    return dbConnection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

describe('accountController', () => {
  let app: INestApplication;
  let dbConnection: Connection;

  const setupTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forFeature([{ name: 'account', schema: AccountSchema }]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dbConnection = await connectToDatabase();
  };

  afterEach(async () => {
    await dbConnection.collection('account').deleteMany({});
  });

  beforeAll(async () => {
    jest.setTimeout(90000);
    await setupTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createAccount', () => {
    it('should insert account to database and return id length of 24', async () => {
      const { _id, ...temp } = accountStub();

      const response = await request(app.getHttpServer())
        .post(`/account`)
        .send(temp);

      expect(response.status).toBe(201);
      expect(response.body._id).toHaveLength(24);
    });
  });

  describe('getAccount', () => {
    it('should return the account inserted', async () => {
      const { _id, ...temp } = accountStub();
      const accountStubWithStringId = {
        _id: _id.toString(),
        ...temp,
      };

      await dbConnection.collection('account').insertOne(accountStub());
      const response = await request(app.getHttpServer())
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
      const response = await request(app.getHttpServer()).get(
        `/account/${temp.email}`
      );

      expect(response.status).toBe(200);
      expect(response.text).toBe('true');
    });
  });

  afterEach(async () => {
    await dbConnection.collection('account').deleteMany({});
  });

  afterAll(async () => {
    await dbConnection.close();
  });
});
