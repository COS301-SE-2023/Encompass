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

        it('should return the created Comment and it should equal to the submitted Comment', async () => {
            const submittedComment: CreateCommentRequest = genericComment;
            mockCommandBus.execute.mockReturnValue(submittedComment);
            const createdComment = await controller.createComment(submittedComment);
            expect(createdComment).toEqual(submittedComment);
        });
    });

    describe('deleteComment', () => {
        it('should call Comment controller with given Comment details', async () => {
            const createCommentSpy = jest.spyOn(controller, 'deleteComment');
            await controller.deleteComment('test1233');
            expect(createCommentSpy).toBeCalledWith('test1233');
        });

        it('should return commandbus boolean when called with id string', async () => {
            mockCommandBus.execute.mockReturnValue(true);
            const deleteResult = await controller.deleteComment('testing123');
            expect(deleteResult).toEqual(true);
        });
    });
});