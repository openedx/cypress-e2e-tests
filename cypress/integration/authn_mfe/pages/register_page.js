const randomNumToString = (Math.random() * 1e20).toString(36)
const randomString = `e2e-${randomNumToString.slice(-5)}`
const randomPassword = `${randomNumToString.slice(0, 8)}784336hsgd`

class RegisterPage {
  // `${randomString}@example.com`
  registerNewUser(name, username, email, password) { 
    cy.get('#name').clear().type(name)
    cy.get('#username').clear().type(username)
    cy.get('#email').clear().type(email)
    cy.get('#password').clear().type(password)
    this.clickSubmit()
  }

  clickSubmit() {
    cy.get('.btn-brand').click()
  }

  registerFailureError() {
    return cy.get('.alert-danger')
  }

  getErrors() {
    return cy.get('.pgn__form-control-description')
  }
  
  getField(field) {
    return cy.get(`#${field}`)
  }

  getTransitioningMessages(field) {
    return cy.get(`[id*="${field}-"] span`)
  }

  getFieldError(field) {
    return cy.get(`[feedback-for=${field}]`)
  }

  enterUsername() {
    cy.get('#username').type('%$%#')
  }

  continueToedX() {
    cy.get('.activate-account-modal-body~.activate-account-modal-button .btn').click()
  }

  successMessage() {
    return cy.get('.message-copy .message-title')
    
  }

}

export default RegisterPage
