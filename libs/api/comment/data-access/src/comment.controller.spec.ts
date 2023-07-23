import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CommentController } from "./comment.controller"
import { Test, TestingModule } from "@nestjs/testing";
import { AddReplyRequest, CreateCommentRequest } from "./dto";

describe('CommentController', () => {
    let controller: CommentController;
    let mockQueryBus: { execute: jest.Mock };
    let mockCommandBus: { execute: jest.Mock };
    const genericComment = {
        postId: 'test12345',
        username: 'tester',
        text: 'testComment'
    }
    const genericCommentDto = {
        id: 'testid123',
        ...genericComment,
        replies: {},
        dateAdded: new Date()
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
            mockCommandBus.execute.mockReturnValue('true');
            const deleteResult = await controller.deleteComment('testing123');
            expect(deleteResult).toEqual('true');
        });
    });

    describe('addReply', () => {
        const { postId,...addReplyRequest } = genericComment;
        it('should call Comment controller with given reply input', async () => {
            const addReplySpy = jest.spyOn(controller, 'addReply');
            await controller.addReply(postId,addReplyRequest);
            expect(addReplySpy).toBeCalledWith(postId,addReplyRequest);
        });

        it('should return the Comment when given postId and reply as arguments', async () => {
            mockCommandBus.execute.mockReturnValue(genericCommentDto);
            const returnedComment = await controller.addReply(postId,addReplyRequest);
            expect(returnedComment).toEqual(genericCommentDto);
        });
    });

    describe('deleteReply', () => {
        it('should call Comment controller with given reply details', async () => {
            const deleteReplySpy = jest.spyOn(controller, 'deleteReply');
            await controller.deleteReply('test1233','test44');
            expect(deleteReplySpy).toBeCalledWith('test1233','test44');
        });

        it('should return commandbus boolean when called with id of comment and reply', async () => {
            mockCommandBus.execute.mockReturnValue('true');
            const deleteResult = await controller.deleteReply('testing123','test44');
            expect(deleteResult).toEqual('true');
        });
    });
    
    describe('getPostComments', () => {
        it('should call Comment controller with given reply details', async () => {
            const getPostCommentsSpy = jest.spyOn(controller, 'getPostComments');
            await controller.getPostComments('test1233');
            expect(getPostCommentsSpy).toBeCalledWith('test1233');
        });

        it('should return commentDto array when called with id of comment and reply', async () => {
            mockQueryBus.execute.mockReturnValue([genericCommentDto]);
            const deleteResult = await controller.getPostComments('testing123');
            expect(deleteResult).toEqual([genericCommentDto]);
        });
    });

    describe('getCommentsByUsername', () => {
        it('should call Comment controller with given reply details', async () => {
            const getCommentsByUsernameSpy = jest.spyOn(controller, 'getCommentsByUsername');
            await controller.getCommentsByUsername('test1233');
            expect(getCommentsByUsernameSpy).toBeCalledWith('test1233');
        });

        it('should return commentDto array when called with id of comment and reply', async () => {
            mockQueryBus.execute.mockReturnValue([genericCommentDto]);
            const deleteResult = await controller.getCommentsByUsername('testing123');
            expect(deleteResult).toEqual([genericCommentDto]);
        });
    });

    describe('get-post-comments', () => {
        it('should call Comment controller with given post id', async () => {
            const getPostCommentsSpy = jest.spyOn(controller, 'getPostComments');
            await controller.getPostComments('test1233');
            expect(getPostCommentsSpy).toBeCalledWith('test1233');
        });

        it('should return commentDto array when called with id of comment and reply', async () => {
            mockQueryBus.execute.mockReturnValue([genericCommentDto]);
            const deleteResult = await controller.getPostComments('testing123');
            expect(deleteResult).toEqual([genericCommentDto]);

        });
    });

});