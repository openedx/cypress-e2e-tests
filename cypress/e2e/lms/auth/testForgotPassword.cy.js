import ForgotPasswordPage from '../../../pages/lms/auth/forgotPasswordPage'
import LoginPage from '../../../pages/lms/auth/loginPage'

describe('[TC_LEARNER_10] Forgot password page tests', () => {
  const forgotPasswordPage = new ForgotPasswordPage()
  const loginPage = new LoginPage()

  const errMsg = {
    mainErrMsg: 'We were unable to contact you.',
    emailErrMsg: 'Enter your email',
    emailErrMsgMin: 'Enter a valid email address',
    successMsg: 'Check your email',
    resetPasswordSuccess1: `We sent an email to ${Cypress.env('LMS_USER_EMAIL')} with instructions to reset your password.`,
    resetPasswordSuccess2: ' If you do not receive a password reset message after 1 minute, verify that you entered the correct email address, or check your spam folder.',
    resetPasswordSuccess3: 'If you need further assistance, contact technical support.',
    retryErrMsgMain: 'An error occurred.',
    retryErrMsg: 'Your previous request is in progress, please try again in a few moments.',
    helpTextMsg: `The email address you used to register with ${Cypress.env('PLATFORM_NAME')}`,
  }
  const userInfo = {
    minEmail: '1',
  }

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    const baseURL = Cypress.env('BASE_MFE_URL')
    cy.visit(`${baseURL}/authn/login`)
    loginPage.clickForgotPassword()
  })

  it('should show correct reset password form structure', () => {
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

  it('should show success messages for recovery password flow', function () {
    forgotPasswordPage.recoverPassword(Cypress.env('LMS_USER_EMAIL'))
    forgotPasswordPage.getErrorMessageTitle().should('contain.text', errMsg.successMsg)
    forgotPasswordPage.getErrorMessageTitle().should('contain.text', errMsg.resetPasswordSuccess1)
    forgotPasswordPage.getErrorMessageTitle().should('contain.text', errMsg.resetPasswordSuccess2)
    forgotPasswordPage.getErrorMessageTitle().should('contain.text', errMsg.resetPasswordSuccess3)
  })

  it('should contain error messages for retry recover password', function () {
    forgotPasswordPage.recoverPassword(Cypress.env('LMS_USER_EMAIL'))
    forgotPasswordPage.getErrorMessageTitle().should('contain.text', errMsg.retryErrMsgMain)
    forgotPasswordPage.getErrorMessageTitle().should('contain.text', errMsg.retryErrMsg)
  })
})
