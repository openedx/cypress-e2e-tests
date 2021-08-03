import ForgotPasswordPage from '../pages/forgot_password_page'
import HelperFunctions from '../helpers/helper_functions'
import LoginPage from '../pages/login_page'

describe('Forgot password page tests', function () {
  const forgotPasswordPage = new ForgotPasswordPage()
  const loginPage = new LoginPage()

  beforeEach(function () {
    cy.visit('/reset')
  })

  it('should show empty field error message', function () {
    forgotPasswordPage.clickSubmit()
    forgotPasswordPage.forgotPasswordFailureError().should('contain.text', 'We were unable to contact you')
    forgotPasswordPage.forgotPasswordFailureError().should('contain.text', 'Enter your email below')
  })

  it('should show invalid format error message', function () {
    forgotPasswordPage.sendForgotPasswordEmail('invalid')
    forgotPasswordPage.forgotPasswordFailureError().should('contain.text', 'We were unable to contact you')
    forgotPasswordPage.forgotPasswordFailureError().should('contain.text', 'Enter a valid email address below')
  })

  it('user can reset their password', function () {
    // const emailID = `${(Math.random() * 1e20).toString(36)}@example.com`
    const emailID = 'test.cypress.test@gmail.com'
    forgotPasswordPage.sendForgotPasswordEmail(emailID)
    forgotPasswordPage.forgotPasswordSuccessMessage().should('contain.text', emailID)
    forgotPasswordPage.forgotPasswordSuccessMessage().should('contain.text', 'Check your email')

    const mailOptions = {
      from: 'no-reply@registration.edx.org',
      to: 'test.cypress.test@gmail.com',
      subject: 'Password reset on edX',
      tryLimit: 80,
      searchInterval: 80000,
    }
    cy.task('mailReader', mailOptions).then((email) => {
      console.log(email)
      cy.visit(HelperFunctions.extractResetLinkFromEmail(email))
    })

    forgotPasswordPage.submitForgetPasswordForm('edxedxedx', 'edxedxedx')
    forgotPasswordPage.newPasswordFeedback().should('have.text', 'Password criteria has not been metPassword must contain at least 8 characters, at least one letter, and at least one number')

    forgotPasswordPage.submitForgetPasswordForm('edxedxedx1', 'edxedxedx12')
    forgotPasswordPage.confirmPasswordFeedback().should('have.text', 'Passwords do not matchPassword must contain at least 8 characters, at least one letter, and at least one number')

    forgotPasswordPage.submitForgetPasswordForm('edxedxedx1', 'edxedxedx1')
    forgotPasswordPage.resetSuccessMessage().should('have.text', 'Password reset complete.')
    .next()
      .should('have.text', 'Your password has been reset. Sign in to your account.')

    loginPage.loginUser('test.cypress.test+779@gmail.com', 'edxedxedx1')
    loginPage.dashboardMyCoursesHeader().should('have.text', 'My Courses')
  })
})
