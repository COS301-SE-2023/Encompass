import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AccountController } from "./account.controller";
import { Test } from "@nestjs/testing";
describe('AccountController', () => {
    let controller: AccountController;
    let mockQueryBus: { execute: jest.Mock };
    let mockCommandBus: { execute: jest.Mock };
    const genericAccount = {
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
    beforeAll(async () => {
        mockCommandBus = { execute: jest.fn() };
        mockQueryBus = { execute: jest.fn() };
        const module = await Test.createTestingModule({
            controllers: [AccountController],
            providers: [ { provide: QueryBus, useValue: mockQueryBus }, { provide: CommandBus, useValue: mockCommandBus }],
        }).compile();
    
        controller = module.get<AccountController>(AccountController);
    });
    
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
})