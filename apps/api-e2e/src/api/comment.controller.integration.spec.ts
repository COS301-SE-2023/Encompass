// import mongoose, { Connection } from "mongoose";
// import request from "supertest";
// //import { AppModule } from "@encompass/api/app.module";
// import { Test, TestingModule } from "@nestjs/testing";
// //import { DatabaseService } from "@encompass/api/dbTest/data-access";
// // eslint-disable-next-line @nx/enforce-module-boundaries
// import { AppModule } from "../../../api/src/app/app.module";
// // import { commentStub } from "../stubs/comment.stub";
// // import { commentDtoStub } from "../stubs/comment.dto.stub";
// // import { replyStub } from "../stubs/reply.stub";
// // import { commentWithReplyStub } from "../stubs/commentWithReply.stub"
// import { HttpStatus, INestApplication } from "@nestjs/common";
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { MongooseModule } from "@nestjs/mongoose";

// describe('CommentController (Integration)', () => {
//     let app: INestApplication;
  
//     beforeAll(async () => {
//       const moduleFixture: TestingModule = await Test.createTestingModule({
//         imports: [AppModule],
//       }).compile();
  
//       app = moduleFixture.createNestApplication();
//       await app.init();
//     });
  
//     afterAll(async () => {
//       await app.close();
//     });
  
//     it('should return an array of comments for a given postId', async () => {
//       const postId = '6499cfd69f9b260697e5511';
  
//       const response = await request(app.getHttpServer()).get(`/comment/get-post-comments/${postId}`);
  
//       expect(response.status).toBe(HttpStatus.OK);
//       expect(Array.isArray(response.body)).toBe(true);
//       // You can add more specific assertions based on your data model and expected response structure.
//     });
//   });

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AppModule } from '../../../api/src/app/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { commentDtoStub } from './stubs/comment.dto.stub'; // Import the commentDtoStub
import { Schema, Document, Model } from 'mongoose';
import { CommentController, CommentModule } from '@encompass/api/comment/data-access';

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
  replies: Reply[]; // Use the Reply interface for the replies property
  dateAdded: Date;
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
  }
);

describe('CommentController (Integration with MongoDB)', () => {
  let app: INestApplication;
  let postId: string;
  let commentModel: Model<Comment>; 

  // Prepare the test data using the commentDtoStub
  const testComment = commentDtoStub();

  const setupTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // AppModule,
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/encompass-test', { // Use your test database URL
          // useCreateIndex: true,
          // useNewUrlParser: true,
          // useUnifiedTopology: true,
        }),
        MongooseModule.forFeature([{ name: 'comment', schema: CommentSchema }])
      ],
      controllers: [CommentController],
      providers:[CommentModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Insert the test comment into the database before running the tests
    // const commentModel = app.get(getModelToken('comment'));
    // await commentModel.create(testComment);
    // postId = testComment.postId;
    commentModel = moduleFixture.get<Model<Comment>>(getModelToken('comment'));
  };

  beforeEach(async () => {
    // Clear the collection before each test
    // const commentModel = app.get(getModelToken('comment'));
    await commentModel.deleteMany({});
    
    // Insert the test comment into the database before running the test
    await commentModel.create(testComment);
    postId = testComment.postId;
  });

  
  beforeAll(async () => {
    await setupTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return an array of comments for a given postId', async () => {
    const response = await request(app.getHttpServer()).get(`/comment/get-post-comments/6499cfd69f9b260697e55181`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].postId).toBe(testComment.postId);
    // You can add more specific assertions based on your data model and expected response structure.
  });
});

