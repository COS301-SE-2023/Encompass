import { INestApplication } from "@nestjs/common";
import mongoose, { Connection, Schema } from "mongoose";
import { AppModule } from "./app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { MongooseModule } from "@nestjs/mongoose";
import request from 'supertest';

export interface Notifications extends Document {
    notifications: {
        notificationId: string;
        sentBy: string;
        picture: string;
        title: string;
        description: string;
        dateTime: Date;
      }[];
}

export const NotificationSchema = new Schema<Notifications>({
    notifications: [
        {
            notificationId: { type: String, required: true },
            sentBy: { type: String, required: true },
            picture: { type: String, required: false },
            title: { type: String, required: true },
            description: { type: String, required: true },
            dateTime: { type: Date, required: true },
        }
    ],
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


describe('NotificationController (Integration with MongoDB)', () => {
  let app: INestApplication; 
  let dbConnection: Connection;

  const setupTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forFeature([{ name: 'notification', schema: NotificationSchema }])
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
    await dbConnection.collection('notification').deleteMany({});
    await app.close();
  });

  describe('createNotification', () => {
    it('should create a notification and return the same ID', async () => {
      // Define the ID to be used in the request
      const idToUse = '5f5b5a6f6d47975aabd8e667';

      // Send a POST request to the /create/:id endpoint
      const response = await request(app.getHttpServer()).post(`/notification/create/${idToUse}`);

      // Assertion
      expect(response.status).toBe(201); // Assuming 201 is the status code for successful creation
      expect(response.body._id).toBe(idToUse); // Check if the returned ID matches the provided ID
    });
    });

   
});

 

