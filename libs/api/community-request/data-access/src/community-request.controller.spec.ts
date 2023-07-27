import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CommunityRequestController } from "./community-request.controller";
import { Test, TestingModule } from "@nestjs/testing";
// import { AddChatRequest, CreateChatListRequest } from "./dto";


describe('CommunityRequestController', () => {


    let controller: CommunityRequestController;
    let mockQueryBus: { execute: jest.Mock };
    let mockCommandBus: { execute: jest.Mock };

    const genericCommmunityRequest={
        requestUsernames :
        ["user1","user2"]
        
    }

    beforeAll(async () => {
        
        mockCommandBus = { execute: jest.fn() };
        mockQueryBus = { execute: jest.fn() };
        const module = await Test.createTestingModule({
            controllers: [CommunityRequestController],
            providers: [ { provide: QueryBus, useValue: mockQueryBus }, { provide: CommandBus, useValue: mockCommandBus }],
        }).compile();
    
        controller = module.get<CommunityRequestController>(CommunityRequestController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create' , () => {
        it('Should call community request controller with community id', async () => {
            const createCommunityRequestSpy = jest.spyOn(controller, 'create');
            await controller.create("community1");
            expect(createCommunityRequestSpy).toBeCalledWith("community1");
        });

        it('should return the created community request and it should equal to the submitted community request', async () => {
            
            const submittedCommunityRequest = {
                _id: 'test123',
                ...genericCommmunityRequest,
            }
            mockCommandBus.execute.mockReturnValueOnce(submittedCommunityRequest);
            const createdCommunityRequest = await controller.create("community1");
            expect(createdCommunityRequest).toEqual(submittedCommunityRequest);

        });
    });

    describe('find' , () => {
        it('Should call community request controller with community id', async () => {
            const findCommunityRequestSpy = jest.spyOn(controller, 'find');
            await controller.find("community1");
            expect(findCommunityRequestSpy).toBeCalledWith("community1");
        });

        it('should return the community request and it should equal to the submitted community request', async () => {
            mockQueryBus.execute.mockReturnValueOnce("community1");
            const foundCommunityRequest = await controller.find("community1");
            expect(foundCommunityRequest).toEqual("community1");

        });

});

describe('addUser', () => {
    it('Should call community request controller with community id and username', async () => {
        const addUserSpy = jest.spyOn(controller, 'addUser');
        await controller.addUser("community1","user1");
        expect(addUserSpy).toBeCalledWith("community1","user1");
    });

    it('should return the community request and it should equal to the submitted community request', async () => {
        const submittedCommunityRequest = {
            _id: 'test123',
            ...genericCommmunityRequest,
        }
        mockCommandBus.execute.mockReturnValueOnce(submittedCommunityRequest);
        const createdCommunityRequest = await controller.addUser("community1","user1");
        expect(createdCommunityRequest).toEqual(submittedCommunityRequest);
    });
});

describe('removeUser', () => {
    it('Should call community request controller with community id and username', async () => {
        const removeUserSpy = jest.spyOn(controller, 'removeUser');
        await controller.removeUser("community1","user1");
        expect(removeUserSpy).toBeCalledWith("community1","user1");
    });

    it('should return the community request and it should equal to the submitted community request', async () => {
        const submittedCommunityRequest = {
            _id: 'test123',
            ...genericCommmunityRequest,
        }
        mockCommandBus.execute.mockReturnValueOnce(submittedCommunityRequest);
        const createdCommunityRequest = await controller.removeUser("community1","user1");
        expect(createdCommunityRequest).toEqual(submittedCommunityRequest);
    });
});

});
