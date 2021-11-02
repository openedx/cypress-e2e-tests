import LoginPage from '../pages/login_page'

describe('Login page tests', function () {
  const loginPage = new LoginPage()

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.visit('/login')
  })

  it('should show empty field error messages', function () {
    loginPage.clickSubmit()
    loginPage.getLoginFailureError().should('contain.text', 'We couldn\'t sign you in.')
    loginPage.getLoginFailureError().should('contain.text', 'Please fill in the fields below.')
  })

  it('should show invalid email or password error message', function () {
    loginPage.loginUser('incorrect@email.com', 'incorrect-password')
    loginPage.getLoginFailureError().should('contain.text', 'We couldn\'t sign you in.')
    loginPage.getLoginFailureError().should('contain.text', 'The username, email, or password you entered is incorrect. Please try again.')
  })

  it('user can successfully login and redirected to dashboard', function () {
    loginPage.loginUser(Cypress.env('ADMIN_USER_EMAIL'), Cypress.env('ADMIN_USER_PASSWORD'))
    loginPage.getDashboardMyCoursesHeader().should('have.text', 'My Courses')
  })
})
