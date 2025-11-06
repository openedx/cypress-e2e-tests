class LoginPage {
  emailOrNameField = '#emailOrUsername'

  passwordField = '#password'

  signInButton = '#sign-in'

  forgotPasswordButton = '#forgot-password'

  loginFailureError = '#login-failure-alert'

  forgotPasswordLink = 'a[href="reset"]'

  loginUser(userEmail, userPassword) {
    if (userEmail) {
      cy.get(this.emailOrNameField).type(userEmail, { force: true })
    }
    if (userPassword) {
      cy.get(this.passwordField).type(userPassword, { force: true })
    }
    this.clickSubmit()
  }

  checkLoginFormStructure() {
    cy.get(this.emailOrNameField).should('be.visible')
    cy.get(this.passwordField).should('be.visible')
    cy.get(this.signInButton).should('be.visible')
    cy.get(this.forgotPasswordButton).should('be.visible')
  }

  clickSubmit() {
    cy.get(this.signInButton).click()
  }

  clearLoginFields() {
    cy.get(this.emailOrNameField).clear()
    cy.get(this.passwordField).clear()
  }

  getLoginFailureError() {
    return cy.get(this.loginFailureError)
  }

  getFeedbackForField(fieldName) {
    return cy.get(`[feedback-for="${fieldName}"]`)
  }

  getPassReset() {
    return cy.get(this.forgotPasswordLink)
  }

  clickPassReset() {
    cy.get(this.forgotPasswordLink).click()
  }

  clickForgotPassword() {
    cy.get(this.forgotPasswordButton).click()
  }
}

export default LoginPage
