import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { commentDtoStub } from './stubs/comment.dto.stub';
import mongoose, { Schema, Document, Connection } from 'mongoose';
import { commentStub } from './stubs/comment.stub';
import { commentWithReplyStub } from './stubs/commentWithReply.stub';


export interface Reply {
  id: string;
  username: string;
  text: string;
  dateAdded: Date;
}

export interface Comment extends Document {
  postId: string;
  username: string;
  text: string;
  replies: Reply[];
  dateAdded: Date;
  profileImage: string;
}

export const CommentSchema = new Schema<Comment>(
  {
    postId: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    replies: [
      {
        id: { type: String, required: true },
        username: { type: String, required: true },
        text: { type: String, required: true },
        dateAdded: { type: Date, required: true },
      },
    ],
    dateAdded: { type: Date, default: Date.now },
    profileImage: { type: String, required: false },
  }
);

const dbUrl = 'mongodb://127.0.0.1:27017/encompass-test'; 

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


describe('CommentController (Integration with MongoDB)', () => {
  let app: INestApplication; 
  let dbConnection: Connection;

  const setupTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forFeature([{ name: 'comment', schema: CommentSchema }])
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dbConnection = await connectToDatabase();
  };

  afterEach(async () => {
    await dbConnection.collection('comment').deleteMany({});
  });

  
  beforeAll(async () => {
    await setupTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createComment', () => {
    it('should create and return the same Comment', async () => {
        const { _id, ...temp } = commentStub();

        const response = await request(app.getHttpServer())
            .post(`/comment/create`)
            .send(temp);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(temp);
    }); 
  });

  describe('deleteComment', () => {
    it('should delete inserted comment and return id of deleted comment', async () => {
      const { _id } = commentDtoStub();

      await dbConnection.collection('comment').insertOne(commentDtoStub());
      const response = await request(app.getHttpServer()).delete(`/comment/delete/${_id.toString()}`);
      expect(response.status).toBe(200);

      expect(response.text).toBe(_id.toString());
    });
});

// describe('addReply', () => {
//     it('should return comment with added reply', async () => {
//         const { _id } = commentDtoStub();

//         await dbConnection.collection('comment').insertOne(commentDtoStub());
//         const response = await request(app.getHttpServer())
//             .patch(`/comment/add-reply/${_id.toString()}`)
//             .send(replyStub());

//         expect(response.status).toBe(200);
//         expect(response.body).not.toEqual(commentDtoStub());
//         expect(response.body.replies[0]).toMatchObject(replyStub());
//     }); 
// });

  describe('deleteReply', () => {
    it('should return true when Comment is found', async () => {
        const replyId = commentWithReplyStub().replies[0].id;
        const commentId = commentWithReplyStub()._id;

        await dbConnection.collection('comment').insertOne(commentWithReplyStub());
        const response = await request(app.getHttpServer())
            .delete(`/comment/delete-reply/${commentId}/${replyId}`);
        
        expect(response.status).toBe(200);
        expect(response.text).toBe(replyId);
    });
  });
});

