import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ProfileController } from "./profile.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateProfileRequest } from "./dto";
import { CreateProfileHandler } from "./commands";

describe('ProfileController', () => {
    let module: TestingModule;
    let controller: ProfileController;
    let commandBus: CommandBus;
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
        //commandBus = module.get<CommandBus>(CommandBus);
        //queryBus = module.get<QueryBus>(QueryBus);

        await module.init();
    });
    
    it('should be defined', () => {
        expect(controller).toBeDefined();
        //expect(commandBus).toBeDefined();
        //expect(queryBus).toBeDefined();
    });

    /*describe('createProfile', () => {
        it('should create a profile with given profile details', async () => {
            const createProfileRequest: CreateProfileRequest = {
                _id: 'test',
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
            
            //const createProfileSpy = jest.spyOn(controller, 'createProfile');
            await controller.createProfile(createProfileRequest);
            //expect(createProfileSpy).toBeCalledWith(createProfileRequest);
        });
    });*/

    describe('getProfile', () => {
        it('should call the profile controller with the given profile id', async () => {
            const getProfileSpy = jest.spyOn(controller, 'getProfile');
            await controller.getProfile('6496e5e9571ba68130d6e1cd');
            expect(getProfileSpy).toBeCalledWith('6496e5e9571ba68130d6e1cd');
        });

        it('should return the profile with the given profile id', async () => {
            const expectProfile = {
                _id: '6496e5e9571ba68130d6e1ca',
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
            mockQueryBus.execute.mockReturnValue(expectProfile);
            expect(await controller.getProfile('6496e5e9571ba68130d6e1cd')).toBe(expectProfile);
        });
    });
});