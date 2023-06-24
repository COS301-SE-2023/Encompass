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

});