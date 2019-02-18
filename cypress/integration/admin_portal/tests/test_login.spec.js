import LoginPage from '../pages/login_page'
import LandingPage from '../pages/landing_page'

describe('Login tests', () => {
  const loginPage = new LoginPage()
  const landingPage = new LandingPage()

  beforeEach(() => {
    cy.visit('/')
  })

  it('does not allow non admin user access', () => {
    // Login as normal user
    loginPage.loginUser(Cypress.env('JOURNAL_USER_EMAIL'), Cypress.env('JOURNAL_USER_PASSWORD'))
    // Check that enterprise list container is not present
    landingPage.enterpriseListContainer().should('not.exist')
  })

  it.only('allows non admin user access', () => {
    // Login as admin user
    loginPage.loginUser(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
    // Check that enterprise list container is present
    landingPage.enterpriseListContainer().should('exist')
  })
})
