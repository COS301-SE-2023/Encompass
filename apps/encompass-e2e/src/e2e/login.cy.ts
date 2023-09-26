import { AccountDto } from "@encompass/api/account/data-access";

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should log in with valid credentials', () => {
    const validAccount: AccountDto = {
      _id: '123456789abc', // Mock user ID
      email: 'valid@example.com',
      password: 'validpassword',
    };
    cy.intercept('POST', '/api/account/login', {
      statusCode: 200,
      body: validAccount,
    }).as('loginApi');

    cy.get('ion-input[name="email"]').type(validAccount.email);
    cy.get('ion-input[name="password"]').type(validAccount.password);
    cy.get('.btn1').click();

    cy.wait('@loginApi');

    cy.url().should('include', '/home');
  });

  it('should display an error toast for invalid credentials', () => {
    const validAccount: AccountDto = {
      _id: '123456789abc', // Mock user ID
      email: 'invalid@example.com',
      password: 'invalidpassword',
    };

    cy.intercept('POST', '/api/account/login', {
      statusCode: 401, // Unauthorized status code
      body: {
        error: 'Invalid credentials', // Mock error message
      },
    }).as('loginApi');

    cy.get('ion-input[name="email"]').type(validAccount.email);
    cy.get('ion-input[name="password"]').type(validAccount.password);
    cy.get('.btn1').click();

    cy.wait('@loginApi');

    cy.url().should('include', '/login');
  });
});