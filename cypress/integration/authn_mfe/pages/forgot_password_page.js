class ForgotPasswordPage {
  sendForgotPasswordEmail(userEmail) {
    cy.get('#forgot-password-input').type(userEmail)
    this.clickSubmit()
  }

  clickSubmit() {
    cy.get('.btn-primary').click()
  }

  forgotPasswordFailureError() {
    return cy.get('.alert-danger')
  }
}

export default ForgotPasswordPage
