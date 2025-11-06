class ForgotPasswordPage {
  emailField = '#email'

  recoverPasswordButton = '#submit-forget-password'

  techSupportLink = 'span > .pgn__hyperlink'

  signIn = '#controlled-tab-tab-\\/login'

  validationErrors = '#validation-errors'

  allEmailErrors = 'div[id^="email-"]'

  checkForgotPasswordFormStructure() {
    cy.get(this.emailField).should('be.visible')
    cy.get(this.recoverPasswordButton).should('be.visible')
  }

  getEmailHelpMsg() {
    cy.get(this.emailField).click()
  }

  checkTechSupportLink() {
    cy.get(this.techSupportLink)
      .should('have.attr', 'href')
      .and('include', 'mailto')
  }

  getAllErrors() {
    return cy.get(this.allEmailErrors)
  }

  recoverPassword(email = '{ESC}') {
    cy.get(this.emailField).type(email)
    cy.get(this.recoverPasswordButton).click()
  }

  getErrorMessageTitle() {
    return cy.get(this.validationErrors)
  }

  clickSignIn() {
    cy.get(this.signIn).click()
  }
}

export default ForgotPasswordPage
