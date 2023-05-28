import { CreateAccountRequest } from "../dto/create-account-request.dto";

export class CreateAccountCommand{
  constructor(public readonly createAccountRequest: CreateAccountRequest){}
}