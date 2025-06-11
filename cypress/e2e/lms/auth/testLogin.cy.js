import LoginPage from '../../../pages/lms/auth/loginPage'

describe('[TC_LEARNER_9] Login page tests', () => {
  const loginPage = new LoginPage()
  const randomString = `${Math.random().toString(36).substring(2, 10)}`

  const errMsg = {
    mainErrMsg: 'We couldn\'t sign you in.',
    mainErrDescription: 'Please fill in the fields below.',
    mainErrIncorrectCredentials: 'The username, email, or password you entered is incorrect. Please try again.',
    emailOrUsernameFieldError: 'Enter your username or email',
    emailErrMsgMin: 'Username or email must have at least 2 characters.',
    passwordErrMsg: 'Enter your password',
    lockedErrMsg: "To protect your account, it's been temporarily locked. Try again in 30 minutes.",
    safeErrMsg: 'To be on the safe side, you can',
  }
  const userInfo = {
    incorrectEmail: 'user_' + randomString + '@example.com',
    incorrectPassword: randomString,
    existingEmail: Cypress.env('LMS_USER_NAME'),
    existingPassword: Cypress.env('LMS_USER_PASSWORD'),
    userForBlock: Cypress.env('EXISTING_USER_FOR_BLOCK'),
    minEmail: '1',
    minPassword: '1',
    adminUserName: Cypress.env('ADMIN_USER_NAME'),
    adminUserPassword: Cypress.env('ADMIN_USER_PASSWORD'),
  }

  before(() => {
    cy.clearCookies()
  })

  beforeEach(() => {
    cy.visit('/login')
  })

  it('should show correct sign in form structure', () => {
    loginPage.checkLoginFormStructure()
  })

  it('should show empty field error messages', () => {
    loginPage.clickSubmit()
    loginPage.getLoginFailureError().should('contain.text', errMsg.mainErrMsg)
    loginPage.getLoginFailureError().should('contain.text', errMsg.mainErrDescription)
    loginPage.getFeedbackForField('emailOrUsername').should('contain.text', errMsg.emailOrUsernameFieldError)
    loginPage.getFeedbackForField('password').should('contain.text', errMsg.passwordErrMsg)
  })

  it('should contain error messages for empty password', function () {
    loginPage.loginUser(userInfo.existingEmail, '')
    loginPage.getLoginFailureError().should('contain.text', errMsg.mainErrMsg)
    loginPage.getLoginFailureError().should('contain.text', errMsg.mainErrDescription)
    loginPage.getFeedbackForField('password').should('contain.text', errMsg.passwordErrMsg)
  })

  it('should show error messages for empty email/username input', function () {
    loginPage.loginUser('', userInfo.existingPassword)
    loginPage.getLoginFailureError().should('contain.text', errMsg.mainErrMsg)
    loginPage.getLoginFailureError().should('contain.text', errMsg.mainErrDescription)
    loginPage.getFeedbackForField('emailOrUsername').should('contain.text', errMsg.emailOrUsernameFieldError)
  })

  it('should show error messages for min email/username and empty password fields', function () {
    loginPage.loginUser(userInfo.minEmail, '')
    loginPage.getLoginFailureError().should('contain.text', errMsg.mainErrMsg)
    loginPage.getLoginFailureError().should('contain.text', errMsg.mainErrDescription)
    loginPage.getFeedbackForField('emailOrUsername').should('contain.text', errMsg.emailErrMsgMin)
    loginPage.getFeedbackForField('password').should('contain.text', errMsg.passwordErrMsg)
  })

  it('should show invalid email or password error message for nonexistent email', function () {
    loginPage.loginUser(userInfo.incorrectEmail, userInfo.incorrectPassword)
    loginPage.getLoginFailureError().should('contain.text', errMsg.mainErrMsg)
    loginPage.getLoginFailureError().should('contain.text', errMsg.mainErrIncorrectCredentials)
  })

  it('should show invalid email or password error message for nonexistent password', function () {
    loginPage.loginUser(userInfo.userForBlock, userInfo.minPassword)
    loginPage.getLoginFailureError().should('contain.text', errMsg.mainErrMsg)
    loginPage.getLoginFailureError().should('contain.text', errMsg.lockedErrMsg)
    loginPage.getLoginFailureError().should('contain.text', errMsg.safeErrMsg)
  })

  it('should show error messages for locked login', function () {
    for (let step = 0; step < 3; step++) {
      loginPage.loginUser(userInfo.userForBlock, userInfo.minPassword)
      loginPage.clearLoginFields()
    }
    loginPage.loginUser(userInfo.userForBlock, userInfo.minPassword)
    loginPage.getLoginFailureError().should('contain.text', errMsg.mainErrMsg)
    loginPage.getLoginFailureError().should('contain.text', errMsg.lockedErrMsg)
    loginPage.getLoginFailureError().should('contain.text', errMsg.safeErrMsg)
    // Reset your password link should be visible
    loginPage.getPassReset().should('be.visible')
    loginPage.clickPassReset()
  })

  it('user can successfully login and redirected to dashboard', () => {
    loginPage.loginUser(userInfo.adminUserName, userInfo.adminUserPassword)
    cy.url().should('contain', 'learner-dashboard')
  })
})
