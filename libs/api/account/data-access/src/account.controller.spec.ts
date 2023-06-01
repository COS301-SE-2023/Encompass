//writing test cases for account.controller.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from './commands/create-account.command';
import { CreateAccountRequest } from './dto/create-account-request.dto';
import { GetAccountRequest } from './dto';
import * as bcrypt from 'bcrypt';
import { GetAccountCommand } from './queries/account.command';
import { Account } from './account';


describe('AccountController', () => {
    let controller: AccountController;
    let commandBus: CommandBus;
    let queryBus: QueryBus;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        controllers: [AccountController],
        providers: [
            {
            provide: CommandBus,
            useValue: {
                execute: jest.fn(),
            },
            },
            {
            provide: QueryBus,
            useValue: {
                execute: jest.fn(),
            },
            },
        ],
        }).compile();
    
        controller = module.get<AccountController>(AccountController);
        commandBus = module.get<CommandBus>(CommandBus);
        queryBus = module.get<QueryBus>(QueryBus);
    });
    
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    
    /*describe('createAccount', () => {
        it('should call commandBus.execute and return the result', async () => {
            const expectedResult = 'test'; // Add your expected result here
            const executeSpy = jest
            .spyOn(commandBus, 'execute')
            .mockResolvedValue(expectedResult);
    
            const result = await controller.createAccount(new CreateAccountRequest());
    
            expect(executeSpy).toHaveBeenCalledWith(new CreateAccountCommand(new CreateAccountRequest()));
            expect(result).toEqual(expectedResult);
        });
    });*/

    describe('getAccount', () => {
        it('should call commandBus.execute and return the result', async () => {
            const expectedResult = 'test'; // Add your expected result here
            const executeSpy = jest
            .spyOn(commandBus, 'execute')
            .mockResolvedValue(expectedResult);
    
            const result = await controller.getAccount(new GetAccountRequest());
            const getAccountRequest = new GetAccountRequest();
            console.log(getAccountRequest.email);

            expect(executeSpy).toHaveBeenCalledWith(new GetAccountCommand(new GetAccountRequest().email, new GetAccountRequest().password));
            expect(result).toEqual(expectedResult);
        });
    });
});