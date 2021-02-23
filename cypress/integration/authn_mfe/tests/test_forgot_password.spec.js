import LoginPage from '../pages/login_page'
import ForgotPasswordPage from '../pages/forgot_password_page'

describe('Forgot password page tests', function () {
  const forgotPasswordPage = new ForgotPasswordPage()
  const loginPage = new LoginPage()

  beforeEach(function () {
    cy.visit('/reset')
  })

  it('should show empty field error message', function () {
    forgotPasswordPage.clickSubmit()
    forgotPasswordPage.forgotPasswordFailureError().should('contain.text', 'We couldn’t send the password recovery email.')
    forgotPasswordPage.forgotPasswordFailureError().should('contain.text', 'Please enter your email.')
  })

  it('should show invalid format error message', function () {
    forgotPasswordPage.sendForgotPasswordEmail('invalid')
    forgotPasswordPage.forgotPasswordFailureError().should('contain.text', 'We couldn’t send the password recovery email.')
    forgotPasswordPage.forgotPasswordFailureError().should('contain.text', 'The email address you\'ve provided isn\'t formatted correctly.')
  })

  it('user can see the success message on login page', function () {
    const emailID = `${(Math.random() * 1e20).toString(36)}@example.com`
    forgotPasswordPage.sendForgotPasswordEmail(emailID)
    loginPage.forgotPasswordSuccessMessage().should('contain.text', emailID)
    loginPage.forgotPasswordSuccessMessage().should('contain.text', 'Check your email')
  })
})
