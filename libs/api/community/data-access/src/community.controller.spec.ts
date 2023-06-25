import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CommunityController } from "./Community.controller";
import { Test } from "@nestjs/testing";
import { CreateCommunityRequest, UpdateCommunityRequest } from "./dto";
import { AddPostCommand } from './commands/add-post/add-post.command'

describe('CommunityController', () => {
    let controller: CommunityController;
    let mockQueryBus: { execute: jest.Mock };
    let mockCommandBus: { execute: jest.Mock };
    const genericCommunity = {
        _id: "example_id",
        name: "Group Name",
        type: "Group Type",
        admin: "Admin Name",
        about: "Group Description",
        rules: "Group Rules",
        groupImage: "image_url.jpg",
        categories: ["category1", "category2"],
        events: ["event1", "event2"],
        posts: ["post1", "post2"],
        members: ["member1", "member2"],
        ageRestricted: true,
        createdAt: "2023-06-24T12:34:56Z",
    }

    beforeAll(async () => {
        mockCommandBus = { execute: jest.fn() };
        mockQueryBus = { execute: jest.fn() };
        const module = await Test.createTestingModule({
            controllers: [CommunityController],
            providers: [ { provide: QueryBus, useValue: mockQueryBus }, { provide: CommandBus, useValue: mockCommandBus }],
        }).compile();
    
        controller = module.get<CommunityController>(CommunityController);
    });
    
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    
})