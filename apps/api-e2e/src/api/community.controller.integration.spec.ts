import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import mongoose, { Connection, Schema } from "mongoose";
import { AppModule } from "./app.module";
import { MongooseModule } from "@nestjs/mongoose";
import request from "supertest";
import { communityDtoStub } from "./stubs/community.dto.stub";
import { ObjectId } from 'mongoose';

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

  beforeAll(() => jest.setTimeout(60000));

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
    });
    
    /*describe('createCommunity', () => {
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
    });*/

    /*describe('updateCommunity', () => {
     it('should update a community', async () => {
         // Create a community in the database to update
         const communityStub = communityDtoStub();
         const insertedCommunity = await dbConnection.collection('community').insertOne(communityStub);
  
         // Replace with the ID of the community to update
         const communityIdToUpdate = insertedCommunity.insertedId.toString();
  
         const updatedData = {
             name: "Updated Community Name",
             about: "Updated community information",
             // Add other properties you want to update
         };
  
         // Send a PATCH request to update the community using the API endpoint
         const response = await request(app.getHttpServer())
             .patch(`/community/${communityIdToUpdate}`)
             .send(updatedData);
  
         // Assertions
         expect(response.status).toBe(200); // Assuming 200 is the status code for successful update
  
         // Fetch the updated community from the database
         const updatedCommunity = await dbConnection.collection('community').findOne({ _id: new mongoose.Types.ObjectId(communityIdToUpdate) });
         // Assert that the properties have been updated in the database
         console.log('Updated Community Name:', updatedCommunity.name + "+");
          console.log('Expected Name:', updatedData.name+ "+");
          console.log('Updated Community About:', updatedCommunity.about+ "+");
          console.log('Expected About:', updatedData.about+ "+");
          //expect(updatedCommunity.name).toEqual(updatedCommunity.name);
         expect(updatedCommunity.name.trim()).toEqual(updatedData.name.trim());
         expect(updatedCommunity.about.trim()).toEqual(updatedData.about.trim());
     });
  
     it('should return 404 for non-existing community', async () => {
         // Replace with a non-existing community ID
         const nonExistingCommunityId = '615013b37e9da47fc5e4eb90'; // Non-existing ObjectId
  
         // Send a PATCH request to update a non-existing community using the API endpoint
         const response = await request(app.getHttpServer())
             .patch(`/community/${nonExistingCommunityId}`)
             .send({ name: "Updated Name" });
  
         // Assertions
         expect(response.status).toBe(404);
     });*/
    // });

    /*describe('addPostToCommunity', () => {
      it('should add a post to a community', async () => {
          // Create a community in the database to add a post to
          const communityStub = communityDtoStub();
          await dbConnection.collection('community').insertOne(communityStub);
  
          // Replace with the name of the community to add a post to
          const communityName = communityStub.name; // Assuming `name` is a property of the inserted community
  
          const newPost = "New Post Content";
  
          // Send a PATCH request to add a post to the community using the API endpoint
          const response = await request(app.getHttpServer())
              .patch(`/community/add-post/${communityName}/${newPost}`);
  
          // Assertions
          expect(response.status).toBe(200); // Assuming 200 is the status code for successful post addition
  
          // Fetch the updated community from the database
          const updatedCommunity = await dbConnection.collection('community').findOne({ name: communityName });
  
          // Assert that the post has been added to the community
          expect(updatedCommunity.posts).toContain(newPost);
      });
  
      it('should return 404 for non-existing community', async () => {
          // Replace with a non-existing community name
          const nonExistingCommunityName = 'Non Existing Community';
  
          const newPost = "New Post Content";
  
          // Send a PATCH request to add a post to a non-existing community using the API endpoint
          const response = await request(app.getHttpServer())
              .patch(`/community/add-post/${nonExistingCommunityName}/${newPost}`);
  
          // Assertions
          expect(response.status).toBe(404);
      });
    });*/

   /*describe('removePostFromCommunity', () => {
     it('should remove a post from a community', async () => {
         // Create a community in the database to remove a post from
         const communityStub = communityDtoStub();
         await dbConnection.collection('community').insertOne(communityStub);
  
         // Replace with the name of the community to remove a post from
         const communityName = communityStub.name;
  
         const postToRemove = communityStub.posts[0];
  
         // Send a PATCH request to remove a post from the community using the API endpoint
         const response = await request(app.getHttpServer())
             .patch(`/community/remove-post/${communityName}/${postToRemove}`);
  
         // Assertions
         expect(response.status).toBe(200); // Assuming 200 is the status code for successful post removal
  
         // Fetch the updated community from the database
         const updatedCommunity = await dbConnection.collection('community').findOne({ name: communityName });
  
         // Assert that the post has been removed from the community
         expect(updatedCommunity.posts).not.toContain(postToRemove);
  
     });
  
     it('should return 404 for non-existing community', async () => {
         // Replace with a non-existing community name
         const nonExistingCommunityName = 'Non Existing Community';
  
         const postToRemove = "Post to Remove";
  
         // Send a PATCH request to remove a post from a non-existing community using the API endpoint
         const response = await request(app.getHttpServer())
             .patch(`/community/remove-post/${nonExistingCommunityName}/${postToRemove}`);
  
         // Assertions
         expect(response.status).toBe(404);
  
     });
  });*/
});


