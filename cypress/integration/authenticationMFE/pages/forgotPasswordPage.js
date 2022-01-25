class ForgotPasswordPage {
  sendForgotPasswordEmail(userEmail) {
    cy.get('#email').type(userEmail)
    this.clickSubmit()
  }

  clickSubmit() {
    cy.get('.btn-brand').click()
  }

  getForgotPasswordFailureError() {
    return cy.get('.alert-danger')
  }

  getForgotPasswordSuccessMessage() {
    return cy.get('.alert-success')
  }
}

export default ForgotPasswordPage
