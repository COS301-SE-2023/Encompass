import { cy } from 'cypress'

describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})