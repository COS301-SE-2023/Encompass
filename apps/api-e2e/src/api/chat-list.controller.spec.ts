import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import mongoose, { Connection, Schema } from "mongoose";
import { AppModule } from "./app.module";
import { MongooseModule } from "@nestjs/mongoose";
import request from 'supertest';
import { chatListDtoStub } from "./stubs/chatlist.dto.stub";

export interface ChatList extends Document {
    username: string;
    chatList: {
        chatRef: string;
        otherUser: string;
    }[];
}

export const ChatListSchema = new Schema<ChatList>(
    {
        username: { type: String, required: true },
        chatList: [
            {
                chatRef: { type: String, required: true },
                otherUser: { type: String, required: true },
            },
        ],
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


describe('ChatController (Integration with MongoDB)', () => {
  let app: INestApplication; 
  let dbConnection: Connection;

  const setupTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forFeature([{ name: 'chat-list', schema: ChatListSchema }])
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dbConnection = await connectToDatabase();
  };

  afterEach(async () => {
    await dbConnection.collection('chat-list').deleteMany({});
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

  describe('createChatList', () => {  
    it('should create a new chat list', async () => {
        const createChatListRequest = {
            username: 'User1',
        };

        // Send a POST request to create a new chat list using the API endpoint
        const response = await request(app.getHttpServer())
            .post('/chat-list/create')
            .send(createChatListRequest);

        // Assertions
        expect(response.status).toBe(201); // Assuming 201 is the status code for successful creation
        expect(response.body).toEqual(expect.objectContaining(createChatListRequest));
    });
    });

    describe('getChatList', () => {
        it('should get a chat list by username', async () => {
            
    
            // Create a chat list in the database to retrieve
            const chatListData = chatListDtoStub();
            const usernameToRetrieve = chatListData.username;
            await dbConnection.collection('chat-list').insertOne(chatListData);
    
            // Send a GET request to retrieve the chat list using the API endpoint
            const response = await request(app.getHttpServer())
                .get(`/chat-list/get-chat-list/${usernameToRetrieve}`);
    
            // Assertions
            expect(response.status).toBe(200); // Assuming 200 is the status code for successful retrieval
            expect(response.body.chatList).toEqual(expect.arrayContaining([
                expect.objectContaining(chatListData.chatList[0]), 
            ]));
            
    
        });
    
        it('should return 404 for non-existing username', async () => {
            const nonExistingUsername = 'NonExistingUser';
    
            // Send a GET request to retrieve a chat list for a non-existing username using the API endpoint
            const response = await request(app.getHttpServer())
                .get(`/chat-list/get-chat-list/${nonExistingUsername}`);
    
            // Assertions
            expect(response.status).toBe(404);
    
        });
    });
    
    describe('addChat', () => {
        it('should add a chat to a chat list', async () => {
            const usernameToAddChat = 'User1';
            const addChatRequest = {
                chatRef: 'test',
                otherUser: 'test2',
            };
    
            //insert chat list
            await dbConnection.collection('chat-list').insertOne({
                username: usernameToAddChat,
                chatList: [],
            });

            // Send a POST request to add a chat to the chat list using the API endpoint
            const response = await request(app.getHttpServer())
                .post(`/chat-list/add-chat/${usernameToAddChat}`)
                .send(addChatRequest);
    
            // Assertions
            expect(response.status).toBe(201); // Assuming 201 is the status code for successful addition
            expect(response.body.chatList).toEqual(expect.arrayContaining([
                expect.objectContaining(addChatRequest), 
            ]));
        });
    });
    

});

