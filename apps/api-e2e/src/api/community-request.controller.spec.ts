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

  beforeAll(() => jest.setTimeout(60000));

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

  describe('findCommunityRequest', () => {
    it('should find a community request by ID', async () => {
        // Replace with a valid community request ID
        const communityRequestId = '5f5b5a6f6d47975aabd8e667';

        // Send a GET request to find a community request by ID using the API endpoint
        const response = await request(app.getHttpServer())
            .get(`/community-request/find/${communityRequestId}`);

        // Assertions
        console.log("findCommunityRequest-1");

        expect(response.status).toBe(200); // Assuming 200 is the status code for successful retrieval
        expect(response.body._id).toBe(communityRequestId);
        
    });

    it('should return 404 for a non-existing community request', async () => {
      // Replace with a non-existing community request ID
      const nonExistingCommunityRequestId = '5f5b5a6f6d47975aabd44467';
  
      // Send a GET request to find a non-existing community request by ID
      const response = await request(app.getHttpServer())
          .get(`/community-request/find/${nonExistingCommunityRequestId}`);
  
      // Assertions
      console.log("findCommunityRequest-2");
      expect(response.status).toBe(404); // Assuming 404 is the status code for not found
  
      
    });
  
  });

  describe('addUserToCommunityRequest', () => {
    it('should add a user to a community request', async () => {
        // Replace with valid community ID and username
        const communityId = '5f5b5a6f6d47975aabd8e667';
        const username = 'User1';

        // Send a PATCH request to add a user to a community request using the API endpoint
        const response = await request(app.getHttpServer())
            .patch(`/community-request/add-user/${communityId}/${username}`);

        // Assertions
        console.log("addUserToCommunityRequest-1")

        expect(response.status).toBe(200); // Assuming 200 is the status code for successful addition

        //..test if username is added to community request
        expect(response.body.requestUsernames).toContain(username);

        
    });

    it('should return 404 for a non-existing community', async () => {
      // Replace with a non-existing community ID and username
      const nonExistingCommunityId = '5f5b5a6f6d47975a4448e667';
      const username = 'User1';
  
      // Send a PATCH request to add a user to a non-existing community
      const response = await request(app.getHttpServer())
          .patch(`/community-request/add-user/${nonExistingCommunityId}/${username}`);
  
      // Assertions
      console.log("addUserToCommunityRequest-2")
      expect(response.status).toBe(404); // Assuming 404 is the status code for not found

      
    });
  
  });

  describe('removeUserFromCommunityRequest', () => {
    it('should remove a user from a community request', async () => {
        // Replace with valid community ID and username
        const communityId = '5f5b5a6f6d47975aabd8e667';
        const username = 'User1';

        // Send a PATCH request to remove a user from a community request using the API endpoint
        const response = await request(app.getHttpServer())
            .patch(`/community-request/remove-user/${communityId}/${username}`);

        expect(response.status).toBe(200); // Assuming 200 is the status code for successful removal

        //..test if username is removed from community request    
        expect(response.body.requestUsernames).not.toContain(username);

        
    });

    it('should return 404 for a non-existing user', async () => {
      // Replace with a non-existing username
      const communityId = '5f5b5a6f6d47975aabd8e667';
      const nonExistingUsername = 'NonExistingUser';

      //add 3 usernames to community request
      const communityIdObject = new mongoose.Types.ObjectId(communityId);

      await dbConnection.collection('community-request').updateOne(
          { _id: communityIdObject },
          { $push: { requestUsernames: { $each: ['User1', 'User2', 'User3'] } } }
      );

      
      // Send a PATCH request to remove a non-existing user from a community request
      const response = await request(app.getHttpServer())
          .patch(`/community-request/remove-user/${communityId}/${nonExistingUsername}`);
  
      expect(response.status).toBe(200); // Assuming 404 is the status code for not found
  
      
    });
  
  });

});