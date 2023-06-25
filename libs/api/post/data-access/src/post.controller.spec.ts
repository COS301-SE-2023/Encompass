import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { PostController } from "./Post.controller";
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

    
})