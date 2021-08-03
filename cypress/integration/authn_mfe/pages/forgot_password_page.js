class ForgotPasswordPage {
  sendForgotPasswordEmail(userEmail) {
    cy.get('#email').type(userEmail)
    this.clickSubmit()
  }

  clickSubmit() {
    cy.get('.btn-brand').click()
  }

  forgotPasswordFailureError() {
    return cy.get('.alert-danger')
  }

  forgotPasswordSuccessMessage() {
    return cy.get('.alert-success')
  }

  submitForgetPasswordForm(newPassword, confirmPassword) {
    cy.get('#newPassword').clear().type(newPassword)
    cy.get('#confirmPassword').clear().type(confirmPassword)
    cy.get('[aria-live="assertive"].btn.btn-brand').click()
  }

  newPasswordFeedback() {
    return cy.get('[feedback-for="newPassword"]')
  }

  confirmPasswordFeedback() {
    return cy.get('[feedback-for="confirmPassword"]')
  }

  resetSuccessMessage() {
    return cy.get('.alert-message-content .h4')
  }

}

export default ForgotPasswordPage
