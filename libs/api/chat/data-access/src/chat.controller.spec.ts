import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ChatController } from "./chat.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateChatRequest } from "./dto";


describe('ChatController', () => {


    let controller: ChatController;
    let mockQueryBus: { execute: jest.Mock };
    let mockCommandBus: { execute: jest.Mock };

    const genericChat={
            users: ["user1", "user2"],
            messages: [
                {
                    username: "user1",
                    message: "message1",
                    dateTime: new Date()
                }
            ]
    }

    beforeAll(async () => {
        
        mockCommandBus = { execute: jest.fn() };
        mockQueryBus = { execute: jest.fn() };
        const module = await Test.createTestingModule({
            controllers: [ChatController],
            providers: [ { provide: QueryBus, useValue: mockQueryBus }, { provide: CommandBus, useValue: mockCommandBus }],
        }).compile();
    
        controller = module.get<ChatController>(ChatController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createChat', () => {
        it('Should call chat controller with chat details', async () => {
            const createChatRequest: CreateChatRequest = {
                users: ["user1", "user2"]} ;           
            
            const createChatSpy = jest.spyOn(controller, 'createChat');
            await controller.createChat(createChatRequest);
            expect(createChatSpy).toBeCalledWith(createChatRequest);
        });

        it('should return the created chat and it should equal to the submitted chat', async () => {
            const createChatRequest: CreateChatRequest = {
                users: ["user1", "user2"]} ;           
            
            mockCommandBus.execute.mockReturnValueOnce(createChatRequest);
            const createdChat = await controller.createChat(createChatRequest); 
            expect(createdChat).toEqual(createChatRequest);
        });
    });

    describe('getChat', () => {
        it('Should call chat controller with chat id', async () => {
            const chatId = "1234";
            const getChatSpy = jest.spyOn(controller, 'getChat');
            await controller.getChat(chatId);
            expect(getChatSpy).toBeCalledWith(chatId);
        });

        it('should return the chat with the given id', async () => {
            const chatId = "1234";
            mockQueryBus.execute.mockReturnValueOnce(genericChat);
            const chat = await controller.getChat(chatId); 
            expect(chat).toEqual(genericChat);
        });
    });

    describe('addMessage', () => {
        it('Should call chat controller with chat id and message details', async () => {
            const chatId = "1234";
            const addMessageRequest = {
                username: "user1",
                message: "message1"
            };
            const addMessageSpy = jest.spyOn(controller, 'addMessage');
            await controller.addMessage(chatId, addMessageRequest);
            expect(addMessageSpy).toBeCalledWith(chatId, addMessageRequest);
        });

        it('should return the chat with the given id', async () => {
            const chatId = "1234";
            const addMessageRequest = {
                username: "user1",
                message: "message1"
            };
            mockCommandBus.execute.mockReturnValueOnce(genericChat);
            const chat = await controller.addMessage(chatId, addMessageRequest); 
            expect(chat).toEqual(genericChat);
        });
    });
});
