import RegisterPage from '../pages/register_page'
import LoginPage from '../pages/login_page'

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
    registerPage.registerFailureError().should('contain.text', 'We couldn\'t create your account.')
    registerPage.registerFailureError().should('contain.text', 'Please check your responses and try again.')
  })

  it('user can successfully register and redirected to dashboard', function () {
    registerPage.registerNewUser()
    loginPage.dashboardMyCoursesHeader().should('have.text', 'My Courses')
  })
})
