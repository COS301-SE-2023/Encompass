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

  describe('getAllCommunities', () => {
    it('should get all communities', async () => {
        const numberOfCommunities = 3; // Change this to the number of communities you want to insert
        
        // Insert multiple community DTO instances into the database
        const communityStubs = Array.from({ length: numberOfCommunities }, () => communityDtoStub());
        await dbConnection.collection('community').insertMany(communityStubs);

        // Fetch all communities using the API endpoint
        const response = await request(app.getHttpServer()).get(`/community/get-all-communities`);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(numberOfCommunities);
    }); 
  });

  describe('getCommunitiesByKeyword', () => {
    it('should get communities by keyword', async () => {
        // Insert multiple community DTO instances into the database
        const communityStubs = [
            communityDtoStub({ customName: "Example Community 1" }),
            communityDtoStub({ customName: "Example Community 2" }),
            communityDtoStub({ customName: "Another Community" }),
        ];
        await dbConnection.collection('community').insertMany(communityStubs);

        // Choose a keyword to search for communities
        const keyword = 'Example';

        // Fetch communities by keyword using the API endpoint
        const response = await request(app.getHttpServer()).get(`/community/get-communities-by-keyword/${keyword}`);

        expect(response.status).toBe(200);

        expect(response.body).toHaveLength(2); // Two communities match the keyword "Example"

        // Assert specific properties of the first and second community
        expect(response.body[0].name).toContain('Example');
        expect(response.body[1].name).toContain('Example');

    });
    });

    /*describe('getRecommendedCommunities', () => {      //TO BE IMPLEMENTED LAST!!!!!
        it('should get recommended communities', async () => {
            // Insert multiple community DTO instances into the database
            const communityStubs = [
                communityDtoStub({ customName: "Recommended Community 1" }),
                communityDtoStub({ customName: "Recommended Community 2" }),
                communityDtoStub({ customName: "Another Community" }),
            ];
            await dbConnection.collection('community').insertMany(communityStubs);
    
            // Replace with the user ID and username to test
            const userId = 'user123';
            const username = 'testuser';
    
            // Fetch recommended communities using the API endpoint
            const response = await request(app.getHttpServer()).get(`/community/get-recommended-communities/${userId}/${username}`);
    
            // Assertions
            expect(response.status).toBe(200);
    
            // Assert that the response body is an array
            expect(Array.isArray(response.body)).toBe(true);
    
            console.log(response.body);
        });
    });
    

    describe('getCommunityByName', () => {
        it('should get a community by name', async () => {
            // Insert a community DTO instance into the database
            const communityStub = communityDtoStub({ customName: "Example Community" });
            await dbConnection.collection('community').insertOne(communityStub);
    
            // Replace with the community name to test
            const communityName = 'Example Community';
    
            // Fetch the community by name using the API endpoint
            const response = await request(app.getHttpServer()).get(`/community/get-community/${communityName}`);
    
            // Assertions
            expect(response.status).toBe(200);
    
            // Assert specific properties of the community in the response
            expect(response.body.name).toBe(communityName);

        });
    
        it('should return nothing for non-existing community', async () => {
            // Replace with a non-existing community name
            const nonExistingCommunityName = 'Non Existing Community';
    
            // Fetch a non-existing community using the API endpoint
            const response = await request(app.getHttpServer()).get(`/community/get-community/${nonExistingCommunityName}`);
    
            // Assertions
            expect(response.status).toBe(200);

            // Assert specific properties of the community in the response
            expect(response.body).toEqual({});

        });
    });*/
    
    describe('createCommunity', () => {
      it('should create a new community', async () => {
          const { _id, createdAt , ...stub } = communityDtoStub();
          // Send a POST request to create a new community using the API endpoint
          const response = await request(app.getHttpServer())
              .post('/community/create')
              .send(stub);
  
          // Assertions
          expect(response.status).toBe(201); // Assuming 201 is the created status code
          expect(response.body).toEqual(expect.objectContaining(stub));
      });
    });

    
});