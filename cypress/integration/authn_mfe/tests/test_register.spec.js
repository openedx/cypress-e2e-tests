import RegisterPage from '../pages/register_page'
import LoginPage from '../pages/login_page'
import HelperFunctions from '../helpers/helper_functions'

describe('Register page tests', function () {
  const registerPage = new RegisterPage()
  const loginPage = new LoginPage()

  const randomNumToString = (Math.random() * 1e20).toString(36)
  const randomString = `e2e-${randomNumToString.slice(-5)}`
  const randomPassword = `${randomNumToString.slice(0, 8)}784336hsgd`
  const randomEmail = `${randomString}@example.com`

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.visit('/register')
  })

  it('should show different errors on register screen', function () {

    registerPage.clickSubmit()
    registerPage.registerFailureError().should('contain.text', 'We couldn\'t create your account.')
    registerPage.registerFailureError().should('contain.text', 'Please check your responses and try again.')
    
    // Verify empty form errors
    registerPage.getErrors().each(($element, index) => {
      const errors = [
        'Enter your full name',
        'Username must be between 2 and 30 characters',
        'Enter your email',
        'Password criteria has not been metPassword must contain at least 8 characters, at least one letter, and at least one number',
        'Select your country or region of residence'
      ]
      cy.wrap($element).should('have.text', errors[index])
    })
    
    // Verify the existing email error
    registerPage.registerNewUser(randomString, randomString, 'smit_01@yopmail.com', randomPassword)
    registerPage.getFieldError('email').should('have.text', 'It looks like this email address is already registered')
    
    // // Verify the invalid username error
    registerPage.registerNewUser(randomString, "$%#%", randomEmail, randomPassword)
    registerPage.getFieldError('username').should('have.text', 'Usernames can only contain letters (A-Z, a-z), numerals (0-9), underscores (_), and hyphens (-).')

    // Email transitioning message
    registerPage.getField('email').click()
    registerPage.getTransitioningMessages('email').should('have.text', 'For account activation and important updates')
    
    // Username transitioning messages
    registerPage.getField('username').click()
    registerPage.getTransitioningMessages('username').each(($element, index) => {
      const messages = [
        'The name that will identify you in your courses.',
        'This can not be changed later.'
      ]
      cy.wrap($element).should('have.text', messages[index])
    })
  })

  it.only('user can successfully register and activate their account', function () {
    
    const uniqueEmail = HelperFunctions.getUniqueEmailAlias(Cypress.env('GMAIL_ID'))
    registerPage.registerNewUser(randomString, randomString, uniqueEmail, 'edxedxedx1')
    // cy.get('.d-flex.align-items-center.justify-content-center').children().contains('Skip for now').click
    cy.contains('Skip for now').click()
    cy.contains('Continue to edX').click()
    loginPage.dashboardMyCoursesHeader().should('have.text', 'My Courses')
    

    const mailOptions = {
      from: 'no-reply@registration.edx.org',
      to: uniqueEmail,
      subject: 'Action Required: Activate your edX account',
      tryLimit: 80,
      searchInterval: 80000,
    }
    cy.task('mailReader', mailOptions).then((email) => {
      registerPage.continueToedX()
      console.log(HelperFunctions.extractActivationLinkFromEmail(email))
      cy.visit(HelperFunctions.extractActivationLinkFromEmail(email))
      registerPage.successMessage().should('have.text', 'Success')
    })
  })
})
