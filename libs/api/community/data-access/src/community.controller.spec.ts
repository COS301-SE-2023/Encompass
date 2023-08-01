import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CommunityController } from "./community.controller";
import { Test } from "@nestjs/testing";
import { CreateCommunityRequest, UpdateCommunityRequest } from "./dto";
import { AddPostCommand } from './commands/add-post/add-post.command'

describe('CommunityController', () => {
    let controller: CommunityController;
    let mockQueryBus: { execute: jest.Mock };
    let mockCommandBus: { execute: jest.Mock };
    let file :Express.Multer.File;
    const genericCommunity = {
        _id: "example_id",
        name: "Group Name",
        type: "Group Type",
        admin: "Admin Name",
        about: "Group Description",
        rules: "Group Rules",
        groupImage: "image_url.jpg",
        bannerImage: "image_url.jpg",
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

    // describe('getCommunity', () => {
    //     it('should call the Community controller with the given id', async () => {
    //         const getCommunitySpy = jest.spyOn(controller, 'getCommunity');
    //         await controller.getCommunity('testid123');
    //         expect(getCommunitySpy).toBeCalledWith('testid123');
    //     });

    //     it('should return the Community submitted', async () => {
    //         mockQueryBus.execute.mockReturnValue(genericCommunity);
    //         const returnedCommunity = await controller.getCommunity('id123');
    //         expect(returnedCommunity).toEqual(genericCommunity);
    //     });
    // });

    describe('getRecommendedCommunities', () => {
        it('Should call the Community controller with the given User id', async () => {	
            const getCommunitySpy = jest.spyOn(controller, 'getRecommendedCommunities');	
            await controller.getRecommendedCommunities('testID', 'testUsername');	
            expect(getCommunitySpy).toBeCalledWith('testID', 'testUsername');	
        });
        it('Should return the list of recommended communities when name is passed in', async () => {
            mockQueryBus.execute.mockReturnValue([genericCommunity]);
            const CommunityExists = await controller.getRecommendedCommunities('testID', 'testUsername');
            expect(CommunityExists).toEqual([genericCommunity]);
        });
    })

    describe('getCommunityByName', () => {
        it('should call Community controller with name', async () => {
            const createCommunitySpy = jest.spyOn(controller, 'getCommunityByName');
            await controller.getCommunityByName('get-community/testname');
            expect(createCommunitySpy).toBeCalledWith('get-community/testname');
        });

        it('should return the a community when given a name parameter', async () => {
            mockQueryBus.execute.mockReturnValue(genericCommunity);
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
            mockCommandBus.execute.mockReturnValue(genericCommunity);
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

    describe('getDoesExist', () => {
        it('should call the Community controller with the given Community id', async () => {
            const getCommunitySpy = jest.spyOn(controller, 'getDoesExist');
            await controller.getDoesExist('testing123');
            expect(getCommunitySpy).toBeCalledWith('testing123');
        });

        it('should return boolean when given Community id', async () => {
            mockQueryBus.execute.mockReturnValue(true);
            const CommunityExists = await controller.getDoesExist('testing123');
            expect(CommunityExists).toEqual(true);
        });
    })

    describe('addPost', () => {
        it('should call the Community controller with the passed in name and post', async () => {
            const getCommunitySpy = jest.spyOn(controller, 'addPost');
            await controller.addPost('add-post/testname/testing123','test-message');
            expect(getCommunitySpy).toBeCalledWith('add-post/testname/testing123','test-message');
        });

        it('should return the Community when name and post string it passed in', async () => {
            mockCommandBus.execute.mockReturnValue(genericCommunity);
            const CommunityExists = await controller.addPost('add-post/testname/testing123','test-message');
            expect(CommunityExists).toEqual(genericCommunity);
        });
    })

    describe('removePost', () => {
        it('should call the Community controller with the passed in name and post', async () => {
            const getCommunitySpy = jest.spyOn(controller, 'removePost');
            await controller.removePost('remove-post/testname/testing123','test-message');
            expect(getCommunitySpy).toBeCalledWith('remove-post/testname/testing123','test-message');
        });

        it('should return the Community when name and post string it passed in', async () => {
            mockCommandBus.execute.mockReturnValue(genericCommunity);
            const CommunityExists = await controller.removePost('remove-post/testname/testing123','test-message');
            expect(CommunityExists).toEqual(genericCommunity);
        });
    })

    describe('deleteCommunity', () => {
        it('Should call the Community controller with the passed in name', async () => {
            const getCommunitySpy = jest.spyOn(controller, 'deleteCommunity');
            await controller.deleteCommunity('delete-community/testname');
            expect(getCommunitySpy).toBeCalledWith('delete-community/testname');
        }); 
        it('Should return the Community when name is passed in', async () => {
            mockCommandBus.execute.mockReturnValue(genericCommunity);
            const CommunityExists = await controller.deleteCommunity('delete-community/testname');
            expect(CommunityExists).toEqual(genericCommunity);
        });

    })

    // describe('uploadImage', () => {

    //     const f: Express.Multer.File=file
    //     it('Should call the Community controller with the passed in File', async () => {
    //         const getCommunitySpy = jest.spyOn(controller, 'uploadImage');
    //         await controller.uploadImage(f);
    //         expect(getCommunitySpy).toBeCalledWith(f);
    //     });
    // })

    
});