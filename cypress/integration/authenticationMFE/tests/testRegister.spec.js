import RegisterPage from '../pages/registerPage'
import LoginPage from '../pages/loginPage'

describe('Register page tests', function () {
  const registerPage = new RegisterPage()
  const loginPage = new LoginPage()

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.visit('/register')
  })

  it('should show empty field error messages', function () {
    registerPage.clickSubmit()
    registerPage.getRegisterFailureError().should('contain.text', 'We couldn\'t create your account.')
    registerPage.getRegisterFailureError().should('contain.text', 'Please check your responses and try again.')
  })

  it('user can successfully register and redirected to dashboard', function () {
    registerPage.registerNewUser()
    loginPage.getWelcomePageHeading().should('have.text', 'A few questions for you will help us get smarter.')
  })
})
