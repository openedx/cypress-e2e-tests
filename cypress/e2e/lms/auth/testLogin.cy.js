import LoginPage from '../../../pages/lms/auth/loginPage'

const loginPage = new LoginPage()

describe('Login page tests', () => {
  before(() => {
    cy.clearCookies()
  })

  beforeEach(() => {
    cy.visit('/login')
  })

  it('should show empty field error messages', () => {
    loginPage.clickSubmit()
    loginPage.getLoginFailureError().should('contain.text', 'We couldn\'t sign you in.')
    loginPage.getLoginFailureError().should('contain.text', 'Please fill in the fields below.')
  })

  it('should show invalid email or password error message', () => {
    loginPage.loginUser('incorrect@email.com', 'incorrect-password')
    loginPage.getLoginFailureError().should('contain.text', 'We couldn\'t sign you in.')
    loginPage.getLoginFailureError().should('contain.text', 'The username, email, or password you entered is incorrect. Please try again.')
  })

  it('user can successfully login and redirected to dashboard', () => {
    loginPage.loginUser(Cypress.env('LMS_USER_NAME'), Cypress.env('LMS_USER_PASSWORD'))
    cy.url().should('contain', 'learner-dashboard')
  })
})
