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

    describe('getCommunity', () => {
        it('should call the Community controller with the given id', async () => {
            const getCommunitySpy = jest.spyOn(controller, 'getCommunity');
            await controller.getCommunity('testid123');
            expect(getCommunitySpy).toBeCalledWith('testid123');
        });

        it('should return the Community submitted', async () => {
            mockQueryBus.execute.mockReturnValue(genericCommunity);
            const returnedCommunity = await controller.getCommunity('id123');
            expect(returnedCommunity).toEqual(genericCommunity);
        });
    });

    describe('getCommunityByName', () => {
        it('should call Community controller with name', async () => {
            const createCommunitySpy = jest.spyOn(controller, 'getCommunityByName');
            await controller.getCommunityByName('get-community/testname');
            expect(createCommunitySpy).toBeCalledWith('get-community/testname');
        });

        it('should return the a community when given a name parameter', async () => {
            mockCommandBus.execute.mockReturnValue(genericCommunity);
            const returnedCommunity = await controller.getCommunityByName('get-community/testname');
            expect(returnedCommunity).toEqual(genericCommunity);
        });
    });

    describe('createCommunity', () => {
        it('should call the Community controller with the given Community', async () => {
            const getCommunitySpy = jest.spyOn(controller, 'createCommunity');
            await controller.createCommunity(genericCommunity);
            expect(getCommunitySpy).toBeCalledWith(genericCommunity);
        });

        it('should return a string representing a boolean value when given a community as a parameter', async () => {
            mockQueryBus.execute.mockReturnValue(genericCommunity);
            const CommunityExists = await controller.createCommunity(genericCommunity);
            expect(CommunityExists).toEqual(genericCommunity);
        });
    })

    describe('updateCommunity', () => {
        const { _id,...communityRequest } = genericCommunity;
        it('should call the Community controller with the given Community id', async () => {
            const getCommunitySpy = jest.spyOn(controller, 'updateCommunity');
            await controller.updateCommunity( _id, communityRequest );
            expect(getCommunitySpy).toBeCalledWith( _id, communityRequest );
        });

        it('should return the Community with the given Community id', async () => {
            mockCommandBus.execute.mockReturnValue(genericCommunity);
            const CommunityExists = await controller.updateCommunity( _id, communityRequest );
            expect(CommunityExists).toEqual({_id, ...communityRequest});
        });
    })

    
})