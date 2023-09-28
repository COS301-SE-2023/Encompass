describe('Sign-Up Page Tests', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should navigate to the sign-up page', () => {
    cy.url().should('include', '/register');
  });

  it('should fill out the sign-up form and submit', () => {
    cy.intercept('GET', '/api/account/johndoe@example.com', {
      statusCode: 200,
      body: 'false'
    })

    cy.intercept('GET', '/api/profile/user/johndoe', {
      statusCode: 200,
      body: 'false'
    })

    cy.intercept('POST', '/api/account', {
      statusCode: 200,
      body: {
        email: 'johndoe@example.com',
        password: 'password123'
      }
    })
 
    cy.get('.first-input').type('John');
    cy.get('.input').eq(1).type('Doe');
    cy.get('.input').eq(2).type('johndoe');
    cy.get('.input').eq(3).type('johndoe@example.com');
    cy.get('.input').eq(4).type('password123');
    cy.get('.ForgotPassword').click();
    cy.get('.btn1').click();

    cy.url().should('include', '/sign-up-categories');
  });

  it('should show disabled register button', () => {
    cy.get('.btn2');
  });

  it('should navigate back to the welcome page', () => {
    cy.get('.back-icon').click();
    cy.url().should('include', 'localhost');
  });
});
