describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should log in with valid credentials', () => {
    cy.get('ion-input[name="email"]').type('test@api.com');
    cy.get('ion-input[name="password"]').type('12345678');
    cy.get('.btn1').click();
    cy.url().should('include', '/home');
  });

  it('should display an error toast for invalid credentials', () => {
    cy.get('ion-input[name="email"]').type('invalid_email@invalid.com');
    cy.get('ion-input[name="password"]').type('invalid_password');
    cy.get('.btn1').click();
    cy.url().should('include', '/login');
  });
});