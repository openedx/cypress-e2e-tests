import {
  expandTocItem,
  verifyTocItemName,
  verifyPageTitle,
  goToPage,
} from '../../support/utils'

describe('Verify Journal Navigation', () => {
  // Login to edX stage using request and get user session
  before(() => {
    cy.login_using_api(Cypress.env('JOURNAL_USER_EMAIL'), Cypress.env('JOURNAL_USER_PASSWORD'))
  })

  beforeEach(() => {
    // Use the above user session to login to Journals
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
    cy.get('.header-actions > .btn').contains('Login').click()
  })

  it('checks TOC panel for logged in user', () => {
    // Click on the Journal card
    cy.contains(Cypress.env('journal_title')).click()
    // Check for the presence of TOC panel
    cy.get('#side-nav-panel-toggle').should('have.text', 'Contents')
    // Check that by default TOC panel is closed
    cy.get('#nav-panel')
      .should('have.class', 'nav-panel-closed')
    // Click on the toggle button to open the TOC Panel
    cy.contains('#side-nav-panel-toggle', 'Content').click()
    // Check that TOC panel is now open and verify Title
    cy.get('#nav-panel')
      .should('have.class', 'nav-panel-open')
      .find('.toc-title').should('have.text', 'TABLE OF CONTENTS')
    // Check the presence of First Main Item(Chapter)
    cy.get('.toc>ul>li').first().as('firstMainItem')
    // Check Chapter Name
    verifyTocItemName('@firstMainItem', 'Chapter 1')
    // Check that by default chapter is not expanded but expands on click
    expandTocItem('@firstMainItem')
    // Check the presence of First Main Item's child
    cy.get('@firstMainItem').find('ul').first().as('firstChildItem')
    // Check Child Name
    verifyTocItemName('@firstChildItem', '1.1')
    // Check that by default child is not expanded but expands on click
    expandTocItem('@firstChildItem')
    // Check the presence of First Main Item's grandchild
    cy.get('@firstChildItem').find('ul').first().as('firstGrandChildItem')
    // Check GrandChild Name
    verifyTocItemName('@firstGrandChildItem', '1.1.1')
  })

  it('browse pages using next and previous button', () => {
    // Click on the Journal card
    cy.contains(Cypress.env('journal_title')).click()
    // Go to a specific page in a specific chapter
    goToPage('Chapter 3', 'First Page')
    // Move to next page and confirm highlighted item and title of page is correct
    cy.contains('.nav-btn', 'Next').click()
    verifyPageTitle('Second Page')
    // Move to next page and confirm highlighted item and title of page is correct
    cy.contains('.nav-btn', 'Next').click()
    verifyPageTitle('Third Page')
    // Move to previous page and confirm highlighted item and title of page is correct
    cy.contains('.nav-btn', 'Previous').click()
    verifyPageTitle('Second Page')
  })
})

