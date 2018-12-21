describe('Verify User Enrollment', () => {
  // Login to LMS using request and get user session
  before(() => {
    cy.register_using_api()
  })

  beforeEach(() => {
    // Use the above user session to login to Journals
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
    cy.get('.header-actions > .btn').contains('Login').click()
  })

  it('enrols new user in journal', () => {
    const journal_url = new RegExp(Cypress.config().baseUrl)
    // Click on the Journal card
    cy.contains(Cypress.env('journal_title')).click()
    cy.contains('Purchase Access').click()
    cy.get('.product-name').should('have.text', Cypress.env('journal_title'))
    cy.get('#line-price>.price').should('have.text', Cypress.env('journal_price'))
    cy.make_payment()
    cy.get('dd.course-description > span').should('have.text', Cypress.env('journal_title'))
    cy.get('.order-line-data > .price').should('have.text', Cypress.env('journal_price'))
    cy.get('.dashboard-link').click()
    cy.get('#journals-link').click()
    cy.get('article').should('have.attr', 'aria-labelledby', `journal-title-${Cypress.env('journal_title')}`).within(() => {
    cy.get('a').invoke('attr', 'href').should('match', journal_url)
    })
  })

  it('enables newly enrolled user to access jourmnal content', () => {
    // Click on the Journal card
    cy.contains(Cypress.env('journal_title')).click()
  })
})