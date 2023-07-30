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
import { CommentSchema } from '@encompass/api/comment/data-access';

describe('CommentController (Integration with MongoDB)', () => {
  let app: INestApplication;
  let postId: string;

  // Prepare the test data using the commentDtoStub
  const testComment = commentDtoStub();

  const setupTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot('mongodb://localhost:27017/encompass-test', { // Use your test database URL
          useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
        MongooseModule.forFeature([{ name: 'comment', schema: CommentSchema }])
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Insert the test comment into the database before running the tests
    const commentModel = app.get(getModelToken('comment'));
    await commentModel.create(testComment);
    postId = testComment.postId;
  };

  beforeAll(async () => {
    await setupTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return an array of comments for a given postId', async () => {
    const response = await request(app.getHttpServer()).get(`/comment/get-post-comments/${postId}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    // You can add more specific assertions based on your data model and expected response structure.
  });
});

