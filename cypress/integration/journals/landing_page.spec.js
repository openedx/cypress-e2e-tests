import {
  verifyLogo,
} from '../../support/utils'

describe('Landing Page Configurations', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Verfies the correct header components', () => {
    // Check for presence of valid site logo in Footer, also check alt text and logo name
    verifyLogo('.site-header', 'site logo', /edx-logo/)
    // Check for the presence of Login button
    cy.get('.header-actions')
      .find('.btn')
      .should('have.text', 'Login')
  })

  it('Verfies the correct footer components', () => {
    const footerTexts = ['FAQ', 'Contact Us']
    // Check for presence of valid site logo in Footer, also check alt text and logo name
    verifyLogo('.footer-content', 'site logo', /edx-logo/)
    // Check for the presence of valid links in footer section
    cy.get('.footer-content')
      .find('u').each(($u, index) => {
        cy.wrap($u).should('have.text', footerTexts[index])
      })
  })

  it('verifies About Page contents for logged out user', () => {
    // Click on the course card containing the name of Test Journal
    cy.contains(Cypress.env('journal_title')).click()
    // Check for the presence of about key word in resulting url
    cy.url().should('include', '/about')
    // Check for the Course Information on course hero image
    cy.get('.hero').within(() => {
      cy.get('h1').should('have.text', Cypress.env('journal_title'))
      cy.get('h2').should('have.text', `${Cypress.env('journal_title')} description`)
      cy.get('.btn').contains(Cypress.env('journal_price'))
    })
  })
})
