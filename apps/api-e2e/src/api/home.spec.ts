import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import mongoose, { Connection, Schema } from "mongoose";
import { AppModule } from "./app.module";
import { MongooseModule } from "@nestjs/mongoose";
import request from 'supertest';

export interface Home extends Document {
    readonly name: string;
}

export const HomeSchema = new Schema<Home>(
    {
        name: { type: String, required: true },
    },
)


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


describe('ChatController (Integration with MongoDB)', () => {
  let app: INestApplication; 
  let dbConnection: Connection;

  const setupTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forFeature([{ name: 'home', schema: HomeSchema }])
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dbConnection = await connectToDatabase();
  };

  afterEach(async () => {
    await dbConnection.collection('home').deleteMany({});
  });

  beforeAll(async () => {
    await setupTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Home', () => {
    it('should return an empty array', async () => {
      // Send a GET request to the / endpoint
      const response = await request(app.getHttpServer()).get('/home');

      // Assertions
      console.log(response.body);
      expect(response.status).toBe(200); // Assuming 200 is the status code for success
      expect(Array.isArray(response.body)).toBe(true); // Check if the response is an array
      expect(response.body.length).toBe(0); // Check if the array is not empty
    });
    });
});
