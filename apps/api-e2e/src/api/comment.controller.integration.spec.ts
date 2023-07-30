import mongoose, { Connection } from "mongoose";
import request from "supertest";
//import { AppModule } from "@encompass/api/app.module";
import { Test, TestingModule } from "@nestjs/testing";
//import { DatabaseService } from "@encompass/api/dbTest/data-access";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AppModule } from "../../../api/src/app/app.module";
// import { commentStub } from "../stubs/comment.stub";
// import { commentDtoStub } from "../stubs/comment.dto.stub";
// import { replyStub } from "../stubs/reply.stub";
// import { commentWithReplyStub } from "../stubs/commentWithReply.stub"
import { HttpStatus, INestApplication } from "@nestjs/common";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from "@nestjs/mongoose";

describe('CommentController (Integration)', () => {
    let app: INestApplication;
  
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      app = moduleFixture.createNestApplication();
      await app.init();
    });
  
    afterAll(async () => {
      await app.close();
    });
  
    it('should return an array of comments for a given postId', async () => {
      const postId = '6499cfd69f9b260697e5511';
  
      const response = await request(app.getHttpServer()).get(`/comment/get-post-comments/${postId}`);
  
      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      // You can add more specific assertions based on your data model and expected response structure.
    });
  });