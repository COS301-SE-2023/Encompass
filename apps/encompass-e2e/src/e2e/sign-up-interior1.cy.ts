/*describe('SignUpInterior1Component', () => {
  beforeEach(() => {
    cy.visit('/sign-up-interior1');
  });

  it('should display at least one category button', () => {
    cy.get('.category-button').should('exist');
  });

  it('should allow the user to select up to 5 categories', () => {
    cy.get('.category-button').first().click();
    cy.get('.category-button').eq(1).click();
    cy.get('.category-button').eq(2).click();
    cy.get('.category-button').eq(3).click();
    cy.get('.category-button').eq(4).click();
    cy.get('.category-button').eq(5).should('not.be.visible');
  });

  it('should enable the "Next" button when 5 categories are selected', () => {
    cy.get('.category-button').first().click();
    cy.get('.category-button').eq(1).click();
    cy.get('.category-button').eq(2).click();
    cy.get('.category-button').eq(3).click();
    cy.get('.category-button').eq(4).click();
    cy.get('.next-button').should('be.enabled');
  });

  it('should navigate to the "sign-up-communities" page when the "Next" button is clicked', () => {
    cy.get('.category-button').first().click();
    cy.get('.category-button').eq(1).click();
    cy.get('.category-button').eq(2).click();
    cy.get('.category-button').eq(3).click();
    cy.get('.category-button').eq(4).click();
    cy.get('.next-button').click();
    cy.url().should('include', '/sign-up-communities');
  });
});*/