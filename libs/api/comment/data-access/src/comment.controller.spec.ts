import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CommentController } from "./comment.controller"
import { Test, TestingModule } from "@nestjs/testing";
import { CreateCommentRequest } from "./dto";

describe('CommentController', () => {
    let controller: CommentController;
    let mockQueryBus: { execute: jest.Mock };
    let mockCommandBus: { execute: jest.Mock };
    const genericComment = {
        postId: 'test12345',
        username: 'tester',
        text: 'testComment'
    }

    beforeAll(async () => {
        mockCommandBus = { execute: jest.fn() };
        mockQueryBus = { execute: jest.fn() };
        const module = await Test.createTestingModule({
            controllers: [CommentController],
            providers: [ { provide: QueryBus, useValue: mockQueryBus }, { provide: CommandBus, useValue: mockCommandBus }],
        }).compile();
    
        controller = module.get<CommentController>(CommentController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createComment', () => {
        it('should call Comment controller with given Comment details', async () => {
            const createCommentRequest: CreateCommentRequest = genericComment;
            
            const createCommentSpy = jest.spyOn(controller, 'createComment');
            await controller.createComment(createCommentRequest);
            expect(createCommentSpy).toBeCalledWith(createCommentRequest);
        });

        
    });
});