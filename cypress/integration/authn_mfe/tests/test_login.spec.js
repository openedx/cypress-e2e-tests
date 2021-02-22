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
    loginPage.loginFailureError().should('contain.text', 'We couldn\'t sign you in.')
    loginPage.loginFailureError().should('contain.text', 'Please enter your Email.')
    loginPage.loginFailureError().should('contain.text', 'Please enter your Password.')
  })

  it('should show invalid email or password error message', function () {
    loginPage.loginUser('incorrect@email.com', 'incorrect-password')
    loginPage.loginFailureError().should('contain.text', 'We couldn\'t sign you in.')
    loginPage.loginFailureError().should('contain.text', 'Email or password is incorrect.')
  })

  it('user can successfully login and redirected to dashboard', function () {
    loginPage.loginUser(Cypress.env('ADMIN_USER_EMAIL'), Cypress.env('ADMIN_USER_PASSWORD'))
    loginPage.dashboardMyCoursesHeader().should('have.text', 'My Courses')
  })
})
