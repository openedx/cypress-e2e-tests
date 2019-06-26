import LoginPage from '../pages/login_page'
import LandingPage from '../pages/landing_page'

describe('Login tests', function() {
  const loginPage = new LoginPage()
  const landingPage = new LandingPage()

  beforeEach(function() {
    cy.visit('/')
  })

  it('does not allow non admin user access', function() {
    // Login as normal user
    loginPage.loginUser(Cypress.env('EDX_NORMAL_USER_EMAIL'), Cypress.env('EDX_NORMAL_USER_PASSWORD'))
    // Check that enterprise list container is not present
    landingPage.enterpriseListContainer().should('not.exist')
  })

  it('allows admin user access on application after lopgin', function() {
    // Login as admin user
    loginPage.loginUser(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
    // Check that enterprise list container is present
    landingPage.enterpriseListContainer().should('exist')
  })
})
