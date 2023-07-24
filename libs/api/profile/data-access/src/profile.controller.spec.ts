import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ProfileController } from "./profile.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateProfileRequest, UpdateProfileRequest } from "./dto";
import { UpdateProfileCommand } from "./commands/update-profile/update-profile.command";
import { GetUsernameQuery } from "./queries/get-username/get-username.query";
import exp = require("constants");

describe('ProfileController', () => {
    let controller: ProfileController;
    let mockQueryBus: { execute: jest.Mock };
    let mockCommandBus: { execute: jest.Mock };
    const genericProfile = {
        username: 'test',
        name: 'test',
        lastName: 'test',
        categories: ['test'],
        communities: ['test'],
        awards: ['test'],
        events: ['test'],
        followers: ['test'],
        following: ['test'],
        posts: ['test'],
        reviews: ['test'],
        profileImage: '',
        profileBanner: '',
        bio: 'test',
    };
    beforeAll(async () => {
        mockCommandBus = { execute: jest.fn() };
        mockQueryBus = { execute: jest.fn() };
        const module = await Test.createTestingModule({
            controllers: [ProfileController],
            providers: [ { provide: QueryBus, useValue: mockQueryBus }, { provide: CommandBus, useValue: mockCommandBus }],
        }).compile();
    
        controller = module.get<ProfileController>(ProfileController);
    });
    
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createProfile', () => {
        it('should call profile controller with given profile details', async () => {
            const createProfileRequest: CreateProfileRequest = {
                _id: 'test123',
                ...genericProfile,
            };
            
            const createProfileSpy = jest.spyOn(controller, 'createProfile');
            await controller.createProfile(createProfileRequest);
            expect(createProfileSpy).toBeCalledWith(createProfileRequest);
        });

        it('should return the created profile and it should equal to the submitted profile', async () => {
            const submittedProfile = {
                _id: 'test123',
                ...genericProfile,
            };
            mockCommandBus.execute.mockReturnValue(submittedProfile);
            const createdProfile = await controller.createProfile(submittedProfile);
            expect(createdProfile).toEqual(submittedProfile);
        });
    });

    describe('getProfile', () => {
        it('should call the profile controller with the given profile id', async () => {
            const getProfileSpy = jest.spyOn(controller, 'getProfile');
            await controller.getProfile('testing123');
            expect(getProfileSpy).toBeCalledWith('testing123');
        });

        it('should return the profile with the given profile id', async () => {
            const expectedProfile = {
                _id: 'testing123',
                ...genericProfile,
            };
            mockQueryBus.execute.mockReturnValue(expectedProfile);
            const returnedProfile = await controller.getProfile('testing123');
            expect(returnedProfile).toEqual(expectedProfile);
        });
    });

    describe('getAllProfiles', () => {
        it('should call the profile controller', async () => {
            const getAllProfilesSpy = jest.spyOn(controller, 'getAllProfiles');
            await controller.getAllProfiles();
            expect(getAllProfilesSpy).toBeCalled();
        });
        it('should return all profiles', async () => {
            const expectedProfiles = [{
                _id: 'testing123',
                ...genericProfile,
            }];
            mockQueryBus.execute.mockReturnValue(expectedProfiles);
            const returnedProfiles = await controller.getAllProfiles();
            expect(returnedProfiles).toEqual(expectedProfiles);
        });
    });

    describe('updateProfile', () => {
        it('should call the profile controller and the commandBus with the user id and profile', async () => {
            const updateProfileRequest: UpdateProfileRequest = {
                ...genericProfile,
            };
            const updateProfileSpy = jest.spyOn(controller, 'updateProfile');
            await controller.updateProfile('test123', updateProfileRequest);
            expect(updateProfileSpy).toBeCalledWith('test123', updateProfileRequest);
            expect(mockCommandBus.execute).not.toBeCalledWith(new UpdateProfileCommand('otherId', updateProfileRequest));
        });
    });

    describe('removePost', () => {
        it('should call the profile controller and the commandBus with the user name and post id', async () => {
            const removePostSpy = jest.spyOn(controller, 'removePost');
            await controller.removePost('test123', 'test123');
            expect(removePostSpy).toBeCalledWith('test123', 'test123');
        });

        it('should return the removed post id', async () => {
            const expectedPostId = 'test123';
            mockCommandBus.execute.mockReturnValue(expectedPostId);
            const returnedPostId = await controller.removePost('test123', 'test123');
            expect(returnedPostId).toEqual(expectedPostId);
    });
    


});


describe('removeCommunity', () => {
    it('should call the profile controller and the commandBus with the user name and community name', async () => {
    const removeCommunitySpy = jest.spyOn(controller, 'removeCommunity');
    await controller.removeCommunity('test123', 'test123');
    expect(removeCommunitySpy).toBeCalledWith('test123','test123');
    });

    it('should return the removed community name', async () => {
        const expectedCommunityName = 'test123';
        mockCommandBus.execute.mockReturnValue(expectedCommunityName);
        const returnedCommunityName = await controller.removeCommunity('test123', 'test123');
        expect(returnedCommunityName).toEqual(expectedCommunityName);
    });
});


describe('addFollower', () => {
    it('should call the profile controller and the commandBus with the user id and follower username', async () => {
        const addFollowerSpy = jest.spyOn(controller, 'addFollower');
        await controller.addFollower('test123', 'test123');
        expect(addFollowerSpy).toBeCalledWith('test123', 'test123');
    });

    it('should return the new user profile that has the added follower', async () => {
        const expectedProfile = {
            _id: 'testing123',
            ...genericProfile,
        }
        mockCommandBus.execute.mockReturnValue(expectedProfile);
        const returnedProfile = await controller.addFollower('test123', 'test123');
        expect(returnedProfile).toEqual(expectedProfile);
    });
});

describe('removeFollower', () => {

    it('should call the profile controller and the commandBus with the user id and follower username', async () => {
        const removeFollowerSpy = jest.spyOn(controller, 'removeFollower');
        await controller.removeFollower('test123', 'test123');
        expect(removeFollowerSpy).toBeCalledWith('test123', 'test123');
    });

    it('should return the new user profile that has removed the follower', async () => {
        const expectedProfile = {
            _id: 'testing123',
            ...genericProfile,
        }
        mockCommandBus.execute.mockReturnValue(expectedProfile);
        const returnedProfile = await controller.removeFollower('test123', 'test123');
        expect(returnedProfile).toEqual(expectedProfile);
    });
});

describe('removeFollowing', () => {
    it('should call the profile controller and the commandBus with the user id and following username', async () => {
    const removeFollowingSpy = jest.spyOn(controller, 'removeFollowing');
    await controller.removeFollowing('test123', 'test123');
    expect(removeFollowingSpy).toBeCalledWith('test123', 'test123');
    });

    it('should return the new user profile that has removed the following', async () => {
        const expectedProfile = {
            _id: 'testing123',
            ...genericProfile,
        }
        mockCommandBus.execute.mockReturnValue(expectedProfile);
        const returnedProfile = await controller.removeFollowing('test123', 'test123');
        expect(returnedProfile).toEqual(expectedProfile);
    });
});


describe('getProfileByUsername', () => {
    it('should call the profile controller with the given username', async () => {
        const getProfileByUsernameSpy = jest.spyOn(controller, 'getProfileByUsername');
        await controller.getProfileByUsername('test');
        expect(getProfileByUsernameSpy).toBeCalledWith('test');
    });

    it('should pass correct correct username to queryBus and return correct profile', async () => {
        const expectedProfile = {
            _id: 'testing123',
            ...genericProfile,
        };
        mockQueryBus.execute.mockReturnValue(expectedProfile);
        const returnedProfileCorrect = await controller.getProfileByUsername('testName');
        expect(mockQueryBus.execute).not.toBeCalledWith(new GetUsernameQuery('anyOtherName'));
        expect(returnedProfileCorrect).toEqual(expectedProfile);
    });
});

describe('getUser', () => {
    it('should call the profile controller with the given username', async () => {
        const getUserSpy = jest.spyOn(controller, 'getUser');
        await controller.getUser('test');
        expect(getUserSpy).toBeCalledWith('test');
    });

    it('should pass correct correct username to queryBus and return correct profile', async () => {
        const expectedProfile = {
            _id: 'testing123',
            ...genericProfile,
        };
        mockQueryBus.execute.mockReturnValue(expectedProfile);
        const returnedProfileCorrect = await controller.getUser('testName');
        expect(mockQueryBus.execute).not.toBeCalledWith(new GetUsernameQuery('anyOtherName'));
        expect(returnedProfileCorrect).toEqual(expectedProfile);
    });
});




});