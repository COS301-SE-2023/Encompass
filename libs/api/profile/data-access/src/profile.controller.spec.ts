import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ProfileController } from "./profile.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateProfileRequest } from "./dto";
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
            expect(await controller.getProfile('testing123')).toBe(expectedProfile);
        });
    });
});