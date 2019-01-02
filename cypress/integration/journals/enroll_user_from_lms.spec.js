import {
  goToPage,
  verifyPageTitle,
  goToNextPage
} from '../../support/utils'

describe('Verify User Enrollment', () => {
  // Login to LMS using request and get user session
  before(() => {
    cy.register_using_api()
  })

  beforeEach(() => {
    // Use the above user session to login
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid') 
  })

  it('enrols new user from the lms', () => {
    const journal_url = new RegExp(Cypress.config().baseUrl)
    // Go to LMS courses page
    const lms_courses_url = `${Cypress.env('lms_url')}courses`
    cy.visit(lms_courses_url)
    // Click on the Journal card
    cy.contains(Cypress.env('journal_title')).click()
    // Click on the Purchase Access button to go to basket page
    cy.contains('Purchase Access').click()
    // Verify name and price on basket page
    cy.get('.product-name').should('have.text', Cypress.env('journal_title'))
    cy.get('#line-price>.price').should('have.text', Cypress.env('journal_price'))
    cy.make_payment()
    // Verify Information on receipt page
    cy.get('dd.course-description > span').should('have.text', Cypress.env('journal_title'))
    cy.get('.order-line-data > .price').should('have.text', Cypress.env('journal_price'))
    // Got to dashboard
    cy.get('.dashboard-link').click()
    // Open the Journals tab on dashboard
    cy.get('#journals-link').click()
    // Verify that newly purchased journal is added
    cy.get('article').should('have.attr', 'aria-labelledby', `journal-title-${Cypress.env('journal_title')}`).within(() => {
    cy.get('a').invoke('attr', 'href').should('match', journal_url)
    })
  })

  it('enables newly enrolled user to access jourmnal content', () => {
    const bodyTexts = ['Simple text', 'Raw html text.']
    const altTexts = ['Apple Sauce', 'Quote']
    const docIds = ['pdf-70efdf2ec9b086079795c442636b55fb', 'pdf-a87ff679a2f3e71d9181a67b7542122c']
    const vidIds = ['xblock_video-e2a2dcc36a08a345332c751b2f2e476c', 'xblock_video-31839b036f63806cba3f47b93af8ccb5']
    // Go to Journals Site
    cy.visit('/')
    cy.get('.header-actions > .btn').contains('Login').click()
    // Click on the Journal card
    cy.contains(Cypress.env('journal_title')).click()
    // Go to Text Page and verify content
    goToPage('Chapter 2', 'Text')
    cy.get('.journal-page-body')
      .find('.body-element p').each(($bodyElement, index) => {
        cy.wrap($bodyElement).should('have.text', bodyTexts[index])
      })
    // Go to Images Page and verify content
    goToNextPage()
    verifyPageTitle('Images')
    cy.get('.journal-page-body')
      .find('.body-element img').each(($bodyElement, index) => {
        cy.wrap($bodyElement).should('have.attr', 'alt', altTexts[index])
      })
    // Go to Documents Page and verify content
    goToNextPage()
    verifyPageTitle('Documents')
    cy.get('.journal-page-body')
      .find('.body-element>span').each(($bodyElement, index) => {
        cy.wrap($bodyElement).should('have.attr', 'id', docIds[index])
      })
    // Go to Videos Page and verify content
    goToNextPage()
    verifyPageTitle('Videos')
    cy.get('.journal-page-body')
      .find('.body-element>span').each(($bodyElement, index) => {
        cy.wrap($bodyElement).should('have.attr', 'id', vidIds[index])
      })
  })
})