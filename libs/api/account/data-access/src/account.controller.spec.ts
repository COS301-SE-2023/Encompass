/*
FILENAME: account.controller.spec.ts

AUTHOR: Morgan Bentley

CREATION DATE: 1 June 2023

DESCRIPTION: This file handles tests for the account creation.
*/

//writing test cases for account.controller.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from './commands/create-account.command';
import * as bcrypt from 'bcrypt';
import { GetAccountCommand } from './queries/account.command';
import { Account } from './account';
import { CreateAccountRequest, GetAccountRequest } from "./dto";

describe('AccountController', () => {
    let controller: AccountController;
    let mockQueryBus: { execute: jest.Mock };
    let mockCommandBus: { execute: jest.Mock };
    const genericAccount = {
        email: "unit@test.com",
        password: "test12334"
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

    describe('createAccount', () => {
        it('should call Account controller with given Account details', async () => {
            const createAccountRequest: CreateAccountRequest = genericAccount;
            const createAccountSpy = jest.spyOn(controller, 'createAccount');
            await controller.createAccount(createAccountRequest);
            expect(createAccountSpy).toBeCalledWith(createAccountRequest);
        });

        it('should return the created Account and it should equal to the submitted Account', async () => {
            const submittedAccount = {
                email: "nit@test.com",
                password: "tes12334"
            };
            mockCommandBus.execute.mockReturnValue(submittedAccount);
            const createdAccount = await controller.createAccount(genericAccount);
            expect(createdAccount).not.toEqual(genericAccount);
            expect(createdAccount).toEqual(submittedAccount);
        });
    });

    describe('getAccount', () => {
        it('should call the Account controller with the given AccountRequest', async () => {
            const submittedAccount: GetAccountRequest = genericAccount;
            const getAccountSpy = jest.spyOn(controller, 'getAccount');
            await controller.getAccount(submittedAccount);
            expect(getAccountSpy).toBeCalledWith(submittedAccount);
        });

        it('should return the Account submitted', async () => {
            const submittedAccount: GetAccountRequest = {
                email: "nit@test.com",
                password: "tes12334"
            };
            mockCommandBus.execute.mockReturnValue(submittedAccount);
            const returnedAccount = await controller.getAccount(submittedAccount);
            expect(returnedAccount).toEqual(submittedAccount);
        });
    });

    describe('getAccountById', () => {
        it('should call the Account controller with the given Account id', async () => {
            const getAccountSpy = jest.spyOn(controller, 'getAccountById');
            await controller.getAccountById('testing123');
            expect(getAccountSpy).toBeCalledWith('testing123');
        });

        it('should return the Account with the given Account id', async () => {
            mockQueryBus.execute.mockReturnValue(true);
            const accountExists = await controller.getAccountById('testing123');
            expect(accountExists).toEqual(true);
        });
    })
})