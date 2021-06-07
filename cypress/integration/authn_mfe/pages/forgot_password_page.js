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
}

export default ForgotPasswordPage
