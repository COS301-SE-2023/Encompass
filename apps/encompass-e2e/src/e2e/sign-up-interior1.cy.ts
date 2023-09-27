import { ProfileDto } from "@encompass/api/profile/data-access";

describe('SignUpInterior1Component', () => {
  const profile: ProfileDto = {
    _id: '123456789abc',
    username: 'testuser',
    name: 'Test',
    lastName: 'User',
    categories: [
      {
        category: 'test',
        score: 0.5,
      },
    ],
    communities: ['test'],
    awards: ['test'],
    events: ['test'],
    followers: ['test'],
    following: ['test'],
    posts: ['test'],
    reviews: ['test'],
    profileImage: 'test',
    profileBanner: 'test',
    bio: 'test',
    ep: 0,
  }

  beforeEach(() => {
    const id = {
      value: '123456789abc',
      expirationTime: Date.now() + 100000,
    }
    cy.window().then((win) =>{
      win.localStorage.setItem("UserID", JSON.stringify(id));
    })

    cy.intercept('GET', '/api/profile/get/123456789abc', {
      statusCode: 200,
      body: profile
    })

    cy.visit('/sign-up-categories');
  });

  it('should display at least one category button', () => {
    cy.get('.Topic').should('exist');
  });

  it('should allow the user to select up to 5 categories', () => {
    cy.get('.Topic').first().click();
    cy.get('.Topic').eq(1).click();
    cy.get('.Topic').eq(2).click();
    cy.get('.Topic').eq(3).click();
    cy.get('.Topic').eq(4).click();
    // cy.get('.Topic').eq(5).should('not.be.visible');
  });

  it('should enable the "Next" button when 5 categories are selected', () => {
    cy.get('.Topic').first().click();
    cy.get('.Topic').eq(1).click();
    cy.get('.Topic').eq(2).click();
    cy.get('.Topic').eq(3).click();
    cy.get('.Topic').eq(4).click();
    cy.get('.btn1').should('be.enabled');
  });

  it('should navigate to the "sign-up-communities" page when the "Next" button is clicked', () => {
    cy.get('.Topic').first().click();
    cy.get('.Topic').eq(1).click();
    cy.get('.Topic').eq(2).click();
    cy.get('.Topic').eq(3).click();
    cy.get('.Topic').eq(4).click();
    cy.get('.btn1').click();
    cy.url().should('include', '/sign-up-communities');
  });
});