import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ProfileController } from "./profile.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateProfileRequest, UpdateProfileRequest } from "./dto";
import { CreateProfileHandler } from "./commands";

describe('ProfileController', () => {
    let controller: ProfileController;
    let mockQueryBus: { execute: jest.Mock };
    let mockCommandBus: { execute: jest.Mock };
    
    beforeEach(async () => {
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
            };
            
            const createProfileSpy = jest.spyOn(controller, 'createProfile');
            await controller.createProfile(createProfileRequest);
            expect(createProfileSpy).toBeCalledWith(createProfileRequest);
        });

        it('should return the created profile and it should equal to the submitted profile', async () => {
            const submittedProfile = {
                _id: 'test123',
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
            };
            mockCommandBus.execute.mockReturnValue(submittedProfile);
            const createdProfile = await controller.createProfile(submittedProfile);
            expect(createdProfile).toBe(submittedProfile);
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
            };
            mockQueryBus.execute.mockReturnValue(expectedProfile);
            const returnedProfile = await controller.getProfile('testing123');
            expect(returnedProfile).toBe(expectedProfile);
        });
    });

    describe('updateProfile', () => {
        it('should call the profile controller with the given profile id and profile details', async () => {
            const updateProfileRequest: UpdateProfileRequest = {
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
            };
            const updateProfileSpy = jest.spyOn(controller, 'updateProfile');
            await controller.updateProfile('test123', updateProfileRequest);
            expect(updateProfileSpy).toBeCalledWith('test123', updateProfileRequest);
        });

        
    });
});