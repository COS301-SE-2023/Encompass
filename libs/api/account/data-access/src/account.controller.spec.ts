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
    //let mockCommandBus: { execute: jest.Mock };
    
    beforeAll(async () => {
        //mockCommandBus = { execute: jest.fn() };
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AccountController],
            providers: [QueryBus, CommandBus],
        }).compile();
    
        controller = module.get<AccountController>(AccountController);
        commandBus = module.get<CommandBus>(CommandBus);
        queryBus = module.get<QueryBus>(QueryBus);
    });
    
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createAccount', () => {
        it('should create an account with given password and email', async () => {
            const password = await bcrypt.hash('test123', 10);
            const createAccountRequest: CreateAccountRequest = {
                email: 'test@gmail.com',
                password: password,
            }
            
            const createAccountSpy = jest.spyOn(controller, 'createAccount');
            await controller.createAccount(createAccountRequest);
            expect(createAccountSpy).toHaveBeenCalledWith(createAccountRequest);
        });

    });    
        
        /*it('should create an account', async () => {
        expect(controller.createAccount({  }));
    */
});