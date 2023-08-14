import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from 'supertest';
import mongoose, { Connection, Schema } from "mongoose";
import { AppModule } from "./app.module";
import { MongooseModule } from "@nestjs/mongoose";
import { chatDtoStub } from "./stubs/chat.dto.stub";

export interface Chat extends Document {
    users: string[];
    messages: {
        username: string;
        message: string;
        dateTime: Date;
    }[],
}

export const ChatSchema = new Schema<Chat>(
    {
        users: {
            type: [String],
            required: true,
        },
        messages: [
            {
                username: {
                    type: String,
                    required: true,
                },
                message: {
                    type: String,
                    required: true, 
                },
                dateTime: {
                    type: Date,
                    required: true,
                },
            },
        ],
    }
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

describe('accountController', () => {
    let app: INestApplication; 
    let dbConnection: Connection;

    const setupTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
        AppModule,
        MongooseModule.forFeature([{ name: 'chat', schema: ChatSchema }])
        ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dbConnection = await connectToDatabase();
    };

    afterEach(async () => {
    await dbConnection.collection('chat').deleteMany({});
    });

    
    beforeAll(async () => {
    await setupTestApp();
    });

    afterAll(async () => {
    await app.close();
    });

    /*describe('createChat', () => {      //env error
      it('should create a new chat', async () => {
          const chatData = {
              users: ['User1', 'User2'],
          };
  
          // Send a POST request to create a new chat using the API endpoint
          const response = await request(app.getHttpServer())
              .post('/chat/create')
              .send(chatData);
  
          // Assertions
          expect(response.status).toBe(201); // Assuming 201 is the created status code
          expect(response.body).toEqual(expect.objectContaining(chatData));
  
          console.log(response.body);
      });
  });*/
  
  describe('getChat', () => {
    it('should get a chat by chatId', async () => {
        // Create a chat in the database to retrieve
        const insertedChat = await dbConnection.collection('chat').insertOne(chatDtoStub());

        // Replace with the chatId of the chat to retrieve
        const chatIdToRetrieve = insertedChat.insertedId.toString();

        // Send a GET request to retrieve the chat using the API endpoint
        const response = await request(app.getHttpServer())
            .get(`/chat/get-chat/${chatIdToRetrieve}`);

        // Assertions
        expect(response.status).toBe(200); // Assuming 200 is the status code for successful retrieval
        //expect(response.body).toEqual(chatDtoStub());
        expect(response.body).toEqual(expect.objectContaining(chatDtoStub()));

    });

    it('should return 404 for non-existing chat', async () => {
        // Replace with a non-existing chatId
        const nonExistingChatId = '615013b37e9da47fc5e4eb90'; // Non-existing ObjectId

        // Send a GET request to retrieve a non-existing chat using the API endpoint
        const response = await request(app.getHttpServer())
            .get(`/chat/get-chat/${nonExistingChatId}`);

        // Assertions
        expect(response.status).toBe(404);
    });
});


});