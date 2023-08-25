import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import mongoose, { Connection, Schema } from "mongoose";
import { AppModule } from "./app.module";
import request from 'supertest';
import { MongooseModule } from "@nestjs/mongoose";
import exp from "constants";

export interface CommunityRequest extends Document {
    requestUsernames: string[];
}

export const CommunityRequestSchema = new Schema<CommunityRequest>(
    {
      requestUsernames: { type: [String], required: true },
    }
);

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


describe('CommunityRequestController (Integration with MongoDB)', () => {
  let app: INestApplication; 
  let dbConnection: Connection;

  const setupTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forFeature([{ name: 'community-request', schema: CommunityRequestSchema }])
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dbConnection = await connectToDatabase();
  };
  
  beforeAll(async () => {
    await setupTestApp();
  });

  afterAll(async () => {
    await dbConnection.collection('community-request').deleteMany({});
    await app.close();
  });

  describe('createCommunityRequest', () => {
    it('should create a community request', async () => {
        // Replace with a valid community ID
        const communityId = '5f5b5a6f6d47975aabd8e667';

        // Send a POST request to create a community request using the API endpoint
        const response = await request(app.getHttpServer())
            .post(`/community-request/create/${communityId}`);

        // Assertions
        expect(response.status).toBe(201); // Assuming 201 is the status code for successful creation

        expect(response.body._id).toBe(communityId);
    });
  });

  

});