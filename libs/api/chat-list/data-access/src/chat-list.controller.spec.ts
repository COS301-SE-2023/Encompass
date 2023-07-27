import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ChatListController } from "./chat-list.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { AddChatRequest, CreateChatListRequest } from "./dto";


describe('ChatListController', () => {


    let controller: ChatListController;
    let mockQueryBus: { execute: jest.Mock };
    let mockCommandBus: { execute: jest.Mock };

    const genericChatList={
            username: "user1",
            chatList: [
                {
                    chatRef: "chat1",
                    otherUser: "user2"
                }]
    }

    beforeAll(async () => {
        
        mockCommandBus = { execute: jest.fn() };
        mockQueryBus = { execute: jest.fn() };
        const module = await Test.createTestingModule({
            controllers: [ChatListController],
            providers: [ { provide: QueryBus, useValue: mockQueryBus }, { provide: CommandBus, useValue: mockCommandBus }],
        }).compile();
    
        controller = module.get<ChatListController>(ChatListController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createChatList', () => {
        it('Should call chat list controller with chat details', async () => {
            const createChatListRequest: CreateChatListRequest = {
                username: "user1"
            }
            const createChatListSpy = jest.spyOn(controller, 'createChatList');
            await controller.createChatList(createChatListRequest);
            expect(createChatListSpy).toBeCalledWith(createChatListRequest);
        });

        it('should return the created chat list and it should equal to the submitted chat list', async () => {
            const createChatListRequest: CreateChatListRequest = {
                username: "user1"
            }
            mockCommandBus.execute.mockReturnValueOnce(createChatListRequest);
            const createdChatList = await controller.createChatList(createChatListRequest); 
            expect(createdChatList).toEqual(createChatListRequest);
        });


        
    });

   
    describe('getChatList', () => {
        it('Should call chat list controller with username', async () => {
            const username = "user1";
            const getChatListSpy = jest.spyOn(controller, 'getChatList');
            await controller.getChatList(username);
            expect(getChatListSpy).toBeCalledWith(username);
    });

    it('return the chat list of the user', async () => {
        mockQueryBus.execute.mockReturnValueOnce(genericChatList);
        const username = "user1";
        const chatList = await controller.getChatList(username);
        expect(chatList).toEqual(genericChatList);
    });
    });

    describe('add-chat' , () => {
        it('Should call chat list controller with username and chatRequest', async () => {
            const addChatRequest : AddChatRequest = {
                chatRef: "chat1",
                otherUser: "user2"
            }
            const username = "user1";
            const addChatSpy = jest.spyOn(controller, 'addChat');
            await controller.addChat(username, addChatRequest);
            expect(addChatSpy).toBeCalledWith(username, addChatRequest);
        });

        it('should return the updated chat list and it should equal to the submitted chat list', async () => {
        mockCommandBus.execute.mockReturnValueOnce(genericChatList);
        const addChatRequest : AddChatRequest = {
            chatRef: "chat1",
            otherUser: "user2"
        }
        const username = "user1";
        const updatedChatList = await controller.addChat(username, addChatRequest);
        expect(updatedChatList).toEqual(genericChatList);
        });
    });
});
