import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import mongoose, { Connection, Schema } from "mongoose";
import { AppModule } from "./app.module";
import { MongooseModule } from "@nestjs/mongoose";
import request from "supertest";
import { communityDtoStub } from "./stubs/community.dto.stub";

export interface Community extends Document {
    name: string;
    type: string;
    admin: string;
    about: string;
    rules: string;
    groupImage: string;
    bannerImage: string;
    categories: string[];
    events: string[];
    posts: string[];
    members: string[];
    ageRestricted: boolean;
    createdAt: string;
}

export const CommunitySchema = new Schema<Community>(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },
        admin: { type: String, required: true },
        about: { type: String, required: true },
        rules: { type: String, required: true },
        groupImage: { type: String, required: false },
        bannerImage: { type: String, required: false },
        categories: [{ type: String, required: true }],
        events: [{ type: String, required: true }],
        posts: [{ type: String, required: true }],
        members: [{ type: String, required: true }],
        ageRestricted: { type: Boolean, required: true },
        createdAt: { type: String, required: true },
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


describe('CommunityController (Integration with MongoDB)', () => {
  let app: INestApplication; 
  let dbConnection: Connection;

  const setupTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forFeature([{ name: 'community', schema: CommunitySchema }])
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dbConnection = await connectToDatabase();
  };

  afterEach(async () => {
    await dbConnection.collection('community').deleteMany({});
  });

  
  beforeAll(async () => {
    await setupTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  
});