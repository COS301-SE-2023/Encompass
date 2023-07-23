import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { PostController } from "./post.controller";
import { Test } from "@nestjs/testing";
import { CreatePostRequest } from "./dto";
describe('PostController', () => {
    let controller: PostController;
    let mockQueryBus: { execute: jest.Mock };
    let mockCommandBus: { execute: jest.Mock };
    const genericPost = {
        _id: "1234test",
        community: "community_name",
        title: "Post Title",
        text: "Post Content",
        username: "john_doe",
        imageUrl: "post_image_url.jpg",
        communityImageUrl: null,
        categories: ["category1", "category2"],
        likes: ["user1", "user2"],
        spoiler: false,
        ageRestricted: false,
    };

    const genericPostRequest = {
        title: "Post Title",
        text: "Post Content",
        imageUrl: "post_image_url.jpg",
        communityImageUrl: null,
        categories: ["category1", "category2"],
        likes: ["user1", "user2"],
        spoiler: false,
        ageRestricted: false,
        shares: 0,
        comments: 0,
        reported: false,
    }

    beforeAll(async () => {
        mockCommandBus = { execute: jest.fn() };
        mockQueryBus = { execute: jest.fn() };
        const module = await Test.createTestingModule({
            controllers: [PostController],
            providers: [ { provide: QueryBus, useValue: mockQueryBus }, { provide: CommandBus, useValue: mockCommandBus }],
        }).compile();
    
        controller = module.get<PostController>(PostController);
    });
    
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createPost', () => {
        it('should call Post controller with given Post details', async () => {
            const createPostSpy = jest.spyOn(controller, 'createPost');
            await controller.createPost(genericPost);
            expect(createPostSpy).toBeCalledWith(genericPost);
        });

        it('should return the created Post and it should equal to the submitted Post', async () => {
            mockCommandBus.execute.mockReturnValue(genericPost);
            const createdPost = await controller.createPost(genericPost);
            expect(createdPost).toEqual(genericPost);
        });
    });

    describe('updatePost', () => {
        it('should call the Post controller with the given PostRequest and id', async () => {
            const getPostSpy = jest.spyOn(controller, 'updatePost');
            await controller.updatePost('123test',genericPostRequest);
            expect(getPostSpy).toBeCalledWith('123test',genericPostRequest);
        });

        it('should return a post when id and postrequest is passed as parameter', async () => {
            mockCommandBus.execute.mockReturnValue(genericPost);
            const returnedPost = await controller.updatePost('123test',genericPostRequest);
            expect(returnedPost).toEqual(genericPost);
        });
    });

    describe('deletePost', () => {
        it('should call the Post controller with the given Post id', async () => {
            const getPostSpy = jest.spyOn(controller, 'deletePost');
            await controller.deletePost('testing123');
            expect(getPostSpy).toBeCalledWith('testing123');
        });

        it('should return string representing boolean when Post id is passed as argument', async () => {
            mockCommandBus.execute.mockReturnValue(true);
            const PostExists = await controller.deletePost('testing123');
            expect(PostExists).toEqual(true);
        });
    })


    describe('getAllPosts', () => {
        it('should call the Post controller', async () => {
            const getPostSpy = jest.spyOn(controller, 'getAllPosts');
            await controller.getAllPosts("test");
            expect(getPostSpy).toBeCalledWith("test");
        });

        it('should return posts array when no argument is passed', async () => {
            mockQueryBus.execute.mockReturnValue([genericPost]);
            const returnedPosts = await controller.getAllPosts("test");
            expect(returnedPosts).toEqual([genericPost]);
        });
    });

    describe('getPostsByUserId', () => {
        it('should call the Post controller with the given string id', async () => {
            const getPostSpy = jest.spyOn(controller, 'getPostsByUserId');
            await controller.getPostsByUserId('id123');
            expect(getPostSpy).toBeCalledWith('id123');
        });

        it('should return a postDto if a string id is passed', async () => {
            mockQueryBus.execute.mockReturnValue(genericPost);
            const returnedPost = await controller.getPostsByUserId('id123');
            expect(returnedPost).toEqual(genericPost);
        });
    });
})