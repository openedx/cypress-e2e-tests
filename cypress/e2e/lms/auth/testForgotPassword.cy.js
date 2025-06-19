import ForgotPasswordPage from '../../../pages/lms/auth/forgotPasswordPage'
import LoginPage from '../../../pages/lms/auth/loginPage'

describe('Forgot password page tests', function () {
  const forgotPasswordPage = new ForgotPasswordPage()
  const loginPage = new LoginPage()

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    const baseURL = Cypress.env('BASE_MFE_URL')
    cy.visit(`${baseURL}/authn/login`)
    loginPage.clickForgotPassword()
  })

  describe('[TC_LEARNER_10] Existing user has a way to login to their account if they forget their password', { tags: '@regression' }, function () {
    it('check forgot password flow', function () {
      cy.contains('Reset password')
      forgotPasswordPage.checkForgotPasswordFormStructure()
      forgotPasswordPage.recoverPassword(Cypress.env('LMS_USER_EMAIL'))
      forgotPasswordPage.getErrorMessageTitle().should('contain.text', 'Check your email')
      // ToDo: when receiving the email, the user should be able to reset their password and log in
    })
  })

  describe('Fields validation check', { tags: '@regression' }, function () {
    const errMsg = {
      mainErrMsg: 'We were unable to contact you.',
      emailErrMsg: 'Enter your email',
      emailErrMsgMin: 'Enter a valid email address',
      successMsg: 'Check your email',
      retryErrMsgMain: 'An error occurred.',
      retryErrMsg: 'Your previous request is in progress, please try again in a few moments.',
      helpTextMsg: `The email address you used to register with ${Cypress.env('PLATFORM_NAME')}`,
    }
    const userInfo = {
      minEmail: '1',
    }

    it('should show correct reset password form structure', function () {
      cy.contains('Reset password')
      cy.contains('Please enter your email address below and we will send you an email with instructions on how to reset your password.')
      forgotPasswordPage.checkForgotPasswordFormStructure()
      cy.contains(`For additional help, contact ${Cypress.env('PLATFORM_NAME')} support at`)
      forgotPasswordPage.checkTechSupportLink()
      forgotPasswordPage.getEmailHelpMsg()
      forgotPasswordPage.getAllErrors().eq(0).should('contain.text', errMsg.helpTextMsg)
    })

    it('should have error messages for empty Email field', function () {
      forgotPasswordPage.recoverPassword()
      forgotPasswordPage.getErrorMessageTitle().should('contain.text', errMsg.mainErrMsg)
      forgotPasswordPage.getAllErrors().eq(1).should('contain.text', errMsg.emailErrMsg)
    })

    it('should have error messages for min Email input field', function () {
      forgotPasswordPage.recoverPassword(userInfo.minEmail)
      forgotPasswordPage.getErrorMessageTitle().should('contain.text', errMsg.mainErrMsg)
      forgotPasswordPage.getAllErrors().eq(1).should('contain.text', errMsg.emailErrMsgMin)
    })

    it('should redirect to Login page', function () {
      forgotPasswordPage.clickSignIn()
      cy.location().should((loc) => {
        expect(loc.pathname.toString()).to.contain('/login')
      })
    })

    it('should contain error messages for retry recover password', function () {
      forgotPasswordPage.recoverPassword(Cypress.env('LMS_USER_EMAIL'))
      forgotPasswordPage.getErrorMessageTitle().should('contain.text', errMsg.retryErrMsgMain)
      forgotPasswordPage.getErrorMessageTitle().should('contain.text', errMsg.retryErrMsg)
    })
  })
})
