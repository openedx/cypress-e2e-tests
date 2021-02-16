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
    registerPage.registerFailureError().should('contain.text', 'Please enter your Full Name.')
    registerPage.registerFailureError().should('contain.text', 'Please enter your Public Username.')
    registerPage.registerFailureError().should('contain.text', 'Please enter your Email.')
    registerPage.registerFailureError().should('contain.text', 'Please enter your Password.')
    registerPage.registerFailureError().should('contain.text', 'Select your country or region of residence.')
  })

  it('user can successfully register and redirected to dashboard', function () {
    registerPage.registerNewUser()
    loginPage.dashboardMyCoursesHeader().should('have.text', 'My Courses')
  })
})
