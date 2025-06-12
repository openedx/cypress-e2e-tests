import RegisterPage from '../../../pages/lms/auth/registerPage'
import randomString from '../../../support/utils'

describe('[TC_LEARNER_8] Registration page tests', function () {
  const registerPage = new RegisterPage()
  const randomUsername = randomString(10)

  const userInfo = {
    fullName: 'Full Name',
    fullNameMax: randomString(260),
    email: `${randomUsername}@example.com`,
    existingEmail: Cypress.env('ADMIN_USER_EMAIL'),
    minEmail: '1',
    username: randomUsername,
    minUsername: '1',
    existingUsername: 'admin',
    wrongUsername: '!@#',
    publicUsernameText: randomString(40),
    password: 'somePassword1',
    minPassword: '1',
    passwordMax: randomString(75),
  }

  const errMsg = {
    mainErrMsg: 'We couldn\'t create your account.',
    mainErrDescription: 'Please check your responses and try again.',
    fullNameErrMsg: 'Enter your full name',
    usernameErrMsg: 'Username must be between 2 and 30 characters',
    usernameErrMsgWrong: 'Usernames can only contain letters (A-Z, a-z), numerals (0-9), underscores (_), and hyphens (-).',
    usernameErrMsgExisting: 'It looks like this username is already taken',
    emailErrMsg: 'Enter your email',
    emailErrMsgExisting: 'This email is already associated with an existing account',
    emailErrMsgWrong: 'Enter a valid email address',
    passwordErrMsg: 'Password criteria has not been met',
    passwordErrMsgMax: 'This password is too long. It must contain no more than 75 characters.',
    similarPasswordErrMsg: 'The password is too similar to the username.',
  }

  const descMsg = {
    fullNameDesc: 'This name will be used by any certificates that you earn.',
    usernameDescFirstLine: 'The name that will identify you in your courses.',
    usernameDescSecondLine: 'This can not be changed later.',
    emailDesc: 'For account activation and important updates',
    passwordDescFistLine: '1 letter',
    passwordDescSecondLine: '1 number',
    passwordDescThirdLine: '8 characters',
  }

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    const baseURL = Cypress.env('BASE_MFE_URL')
    cy.visit(`${baseURL}/authn/register`)
  })

  it('should show correct register form structure', function () {
    registerPage.checkRegisterFormStructure()
  })

  it('should contain error messages for empty input', function () {
    registerPage.prepareUserRegistration()
    registerPage.clickRegisterButton()
    registerPage.getErrorMessageTitle().should('contain.text', errMsg.mainErrMsg)
    registerPage.getErrorMessageTitle().should('contain.text', errMsg.mainErrDescription)
    registerPage.getFieldError('name').should('contain.text', errMsg.fullNameErrMsg)
    registerPage.getFieldError('email').should('contain.text', errMsg.emailErrMsg)
    registerPage.getFieldError('username').should('contain.text', errMsg.usernameErrMsg)
    registerPage.getFieldError('password').should('contain.text', errMsg.passwordErrMsg)
  })

  it('new user registers for an account', function () {
    if (!Cypress.env('ENABLE_REGISTER_NEW_USER')) {
      this.skip()
    }
    registerPage.prepareUserRegistration(
      userInfo.fullName,
      userInfo.email,
      userInfo.publicUsernameText,
      userInfo.password,
    )
    registerPage.clickRegisterButton()
    cy.url().should('contain', 'learner-dashboard')
  })

  // ---Full name---
  it('should be visible Full name description field', function () {
    registerPage.getFieldDescription('name', descMsg.fullNameDesc)
  })

  it('check Full name field max length', function () {
    registerPage.checkMaxFullName(userInfo.fullNameMax)
  })

  it('should contain error messages for Full Name empty field', function () {
    registerPage.prepareUserRegistration(
      '{ESC}',
      userInfo.email,
      userInfo.username,
      userInfo.password,
    )
    registerPage.clickRegisterButton()
    registerPage.getErrorMessageTitle().should('contain.text', errMsg.mainErrMsg)
    registerPage.getErrorMessageTitle().should('contain.text', errMsg.mainErrDescription)
    registerPage.getFieldError('name').should('contain.text', errMsg.fullNameErrMsg)
  })

  // ---Email---
  it('should be visible Email description field', function () {
    registerPage.getFieldDescription('email', descMsg.emailDesc)
  })

  it('should contain error message for existing Email input', function () {
    registerPage.prepareUserRegistration(
      userInfo.fullName,
      userInfo.existingEmail,
      userInfo.username,
      userInfo.password,
    )
    registerPage.registerUser()
    registerPage.getFieldError('email').should('contain.text', errMsg.emailErrMsgExisting)
  })

  it('should contain error message for Email min length input', function () {
    registerPage.prepareUserRegistration(
      userInfo.fullName,
      userInfo.minEmail,
      userInfo.username,
      userInfo.password,
    )
    registerPage.clickRegisterButton()
    registerPage.getFieldError('email').should('contain.text', errMsg.emailErrMsgWrong)
  })

  it('should contain error messages for empty fields: Email', function () {
    registerPage.prepareUserRegistration(
      userInfo.fullName,
      '{ESC}',
      userInfo.username,
      userInfo.password,
    )
    registerPage.clickRegisterButton()
    registerPage.getErrorMessageTitle().should('contain.text', errMsg.mainErrMsg)
    registerPage.getErrorMessageTitle().should('contain.text', errMsg.mainErrDescription)
    registerPage.getFieldError('email').should('contain.text', errMsg.emailErrMsg)
  })

  // ---Public username---
  it('should be visible Public username description field', function () {
    registerPage.getFieldDescription('username', descMsg.usernameDescFirstLine)
    registerPage.getFieldDescription('username', descMsg.usernameDescSecondLine)
  })

  it('should contain error message for Public username min length input', function () {
    registerPage.prepareUserRegistration(
      '{ESC}',
      '{ESC}',
      userInfo.minUsername,
    )
    registerPage.clickRegisterButton()
    registerPage.getFieldError('username').should('contain.text', errMsg.usernameErrMsg)
  })

  it('check Public Username max 30 symbols', function () {
    registerPage.checkUsername(userInfo.publicUsernameText)
  })

  it('should contain error message for Public username incorrect symbols input', function () {
    registerPage.prepareUserRegistration(
      userInfo.fullName,
      userInfo.email,
      userInfo.wrongUsername,
      userInfo.password,
    )
    registerPage.clickRegisterButton()
    registerPage.getFieldError('username').should('contain.text', errMsg.usernameErrMsgWrong)
  })

  it('should contain error message for existing Public username input', function () {
    registerPage.prepareUserRegistration(
      userInfo.fullName,
      userInfo.email,
      userInfo.existingUsername,
      userInfo.password,
    )
    registerPage.clickRegisterButton()
    registerPage.getFieldError('username').should('contain.text', errMsg.usernameErrMsgExisting)
  })

  it('should contain error messages for empty fields: Public username', function () {
    registerPage.prepareUserRegistration(
      userInfo.fullName,
      userInfo.email,
      '{ESC}',
      userInfo.password,
    )
    registerPage.clickRegisterButton()
    registerPage.getErrorMessageTitle().should('contain.text', errMsg.mainErrMsg)
    registerPage.getErrorMessageTitle().should('contain.text', errMsg.mainErrDescription)
    registerPage.getFieldError('username').should('contain.text', errMsg.usernameErrMsg)
  })

  // ---Password---
  it('should be visible Password description field', function () {
    registerPage.getFieldDescription('password', descMsg.passwordDescFistLine)
    registerPage.getFieldDescription('password', descMsg.passwordDescSecondLine)
    registerPage.getFieldDescription('password', descMsg.passwordDescThirdLine)
  })

  it('should contain error message for Password max length field', function () {
    registerPage.prepareUserRegistration(
      userInfo.fullName,
      userInfo.email,
      userInfo.username,
      `${userInfo.passwordMax}_1`,
    )
    registerPage.clickRegisterButton()
    registerPage.getFieldError('password').should('contain.text', errMsg.passwordErrMsgMax)
  })

  it('should contain error message for Password min length field', function () {
    registerPage.prepareUserRegistration(
      userInfo.fullName,
      userInfo.email,
      userInfo.username,
      userInfo.minPassword,
    )
    registerPage.clickRegisterButton()
    registerPage.getFieldError('password').should('contain.text', errMsg.passwordErrMsg)
  })

  it('should contain error message for Password is too similar with username', function () {
    registerPage.prepareUserRegistration(
      userInfo.fullName,
      userInfo.email,
      userInfo.username,
      `${userInfo.username}_1`,
    )
    registerPage.registerUser()
    registerPage.getFieldError('password').should('contain.text', errMsg.similarPasswordErrMsg)
  })

  it('should contain error messages for empty fields: Password', function () {
    registerPage.prepareUserRegistration(
      userInfo.fullName,
      userInfo.email,
      userInfo.username,
      '{ESC}',
    )
    registerPage.clickRegisterButton()
    registerPage.getErrorMessageTitle().should('contain.text', errMsg.mainErrMsg)
    registerPage.getErrorMessageTitle().should('contain.text', errMsg.mainErrDescription)
    registerPage.getFieldError('password').should('contain.text', errMsg.passwordErrMsg)
  })
})
