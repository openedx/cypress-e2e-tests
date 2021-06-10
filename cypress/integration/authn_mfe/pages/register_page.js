class RegisterPage {
  registerNewUser() {
    const randomNumToString = (Math.random() * 1e20).toString(36)
    const randomString = `e2e-${randomNumToString.slice(-5)}`
    const randomPassword = `${randomNumToString.slice(0, 8)}784336hsgd`
    cy.get('#name').type(randomString)
    cy.get('#username').type(randomString)
    cy.get('#email').type(`${randomString}@example.com`)
    cy.get('#password').type(randomPassword)
    this.clickSubmit()
  }

  clickSubmit() {
    cy.get('.btn-brand').click()
  }

  registerFailureError() {
    return cy.get('.alert-danger')
  }
}

export default RegisterPage
