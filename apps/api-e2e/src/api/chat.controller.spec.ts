import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from 'supertest';
import mongoose, { Connection, Schema } from "mongoose";
import { AppModule } from "./app.module";
import { MongooseModule } from "@nestjs/mongoose";
import { chatDtoStub } from "./stubs/chat.dto.stub";
import { HttpModule } from "@nestjs/axios";

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
        HttpModule,
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

    beforeEach((): void => {
        jest.setTimeout(60000);
        // p = new SUT.PlaywrightFluent();
      });
      
    beforeAll(async () => {
    await setupTestApp();
    });

    afterAll(async () => {
    await app.close();
    });

    /*describe('createChat', () => {      //connect ECONNREFUSED ::1:3000
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

  describe('addMessageToChat', () => {
    it('should add a message to a chat', async () => {
        // Create a chat in the database to add a message to
        const chatData = {
            users: ['User1', 'User2'],
            messages: [],
        };
        const insertedChat = await dbConnection.collection('chat').insertOne(chatData);

        // Replace with the chatId of the chat to add a message to
        const chatIdToAddMessage = insertedChat.insertedId.toString();

        const newMessage = {
            username: 'User1',
            message: 'New message content',
        };

        // Send a PATCH request to add a message to the chat using the API endpoint
        const response = await request(app.getHttpServer())
            .patch(`/chat/add-message/${chatIdToAddMessage}`)
            .send(newMessage);

        // Assertions
        expect(response.status).toBe(200); // Assuming 200 is the status code for successful message addition

        // Fetch the updated chat from the database
        const updatedChat = await dbConnection.collection('chat').findOne({ _id: new mongoose.Types.ObjectId(chatIdToAddMessage) });

        // Assert that the message has been added to the chat's messages array
        expect(updatedChat.messages).toEqual(expect.arrayContaining([
          expect.objectContaining({
              message: newMessage.message,
              username: newMessage.username,
          })
        ]));
    });

    it('should return 404 for non-existing chat', async () => {
        // Replace with a non-existing chatId
        const nonExistingChatId = '615013b37e9da47fc5e4eb90'; // Non-existing ObjectId

        const newMessage = {
            username: 'User1',
            message: 'New message content',
            dateTime: new Date(),
        };

        // Send a PATCH request to add a message to a non-existing chat using the API endpoint
        const response = await request(app.getHttpServer())
            .patch(`/chat/add-message/${nonExistingChatId}`)
            .send(newMessage);

        // Assertions
        expect(response.status).toBe(404);
    });
  });

});