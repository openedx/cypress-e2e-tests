import {
  goToPage,
} from '../../support/utils'


describe('Verify Journal Pages content', () => {
  // Login to edX stage using ui
  before(() => {
    cy.visit('/')
    cy.clearCookies()
    cy.login_from_ui(Cypress.env('JOURNAL_USER_EMAIL'), Cypress.env('JOURNAL_USER_PASSWORD'))
  })

  beforeEach(() => {
    // Use the logged in user cookies for all tests
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
    cy.get('.hero').should('be.visible')
    cy.get('.header-actions .btn').then(($btn) => {
      if ($btn.text() === 'Login') {
        cy.wrap($btn).click()
      }
    })
  })

  it('checks Text page', () => {
    const bodyTexts = ['Simple text', 'Raw html text.']
    // Click on the Journal card
    cy.contains(Cypress.env('journal_title')).click()
    // Go to a specific page in a specific chapter
    goToPage('Chapter 2', 'Text')
    cy.get('.journal-page-body')
      .find('.body-element p').each(($bodyElement, index) => {
        cy.wrap($bodyElement).should('have.text', bodyTexts[index])
      })
  })

  it('checks Images page', () => {
    const altTexts = ['Apple Sauce', 'Quote']
    // Click on the Journal card
    cy.contains(Cypress.env('journal_title')).click()
    // Go to a specific page in a specific chapter
    goToPage('Chapter 2', 'Images')
    cy.get('.journal-page-body')
      .find('.body-element img').each(($bodyElement, index) => {
        cy.wrap($bodyElement).should('have.attr', 'alt', altTexts[index])
      })
  })

  it('checks Documents page', () => {
    const docIds = ['pdf-70efdf2ec9b086079795c442636b55fb', 'pdf-a87ff679a2f3e71d9181a67b7542122c']
    // Click on the Journal card
    cy.contains(Cypress.env('journal_title')).click()
    // Go to a specific page in a specific chapter
    goToPage('Chapter 2', 'Documents')
    cy.get('.journal-page-body')
      .find('.body-element>span').each(($bodyElement, index) => {
        cy.wrap($bodyElement).should('have.attr', 'id', docIds[index])
      })
  })

  it('checks Video page', () => {
    const vidIds = ['xblock_video-e2a2dcc36a08a345332c751b2f2e476c', 'xblock_video-31839b036f63806cba3f47b93af8ccb5']
    // Click on the Journal card
    cy.contains(Cypress.env('journal_title')).click()
    // Go to a specific page in a specific chapter
    goToPage('Chapter 2', 'Videos')
    cy.get('.journal-page-body')
      .find('.body-element>span').each(($bodyElement, index) => {
        cy.wrap($bodyElement).should('have.attr', 'id', vidIds[index])
      })
  })
})
