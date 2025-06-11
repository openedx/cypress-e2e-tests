class RegisterPage {
  fullNameField = '#name'

  emailField = '#email'

  usernameField = '#username'

  passwordField = '#password'

  registerButton = '#register-user'

  validationErrors = '#validation-errors'

  descriptionField = (desc) => `span:contains(${desc})`

  checkRegisterFormStructure() {
    cy.get(this.fullNameField).should('be.visible')
    cy.get(this.emailField).should('be.visible')
    cy.get(this.usernameField).should('be.visible')
    cy.get(this.passwordField).should('be.visible')
    cy.get(this.registerButton).should('be.visible')
  }

  prepareUserRegistration(
    fullName = '{ESC}',
    email = '{ESC}',
    username = '{ESC}',
    password = '{ESC}',
  ) {
    cy.get(this.usernameField).type(username)
    cy.get(this.emailField).type(email)
    cy.get(this.fullNameField).type(fullName)
    cy.get(this.passwordField).type(password)
  }

  clickRegisterButton() {
    cy.get(this.registerButton).click()
  }

  registerUser() {
    cy.intercept('POST', '/api/user/v2/account/registration').as('createUser')
    cy.get(this.registerButton).click()
    return cy.wait('@createUser')
  }


  getErrorMessageTitle() {
    return cy.get(this.validationErrors)
  }

  getFieldError(fieldName) {
    return cy.get(`[id^="${fieldName}-"]`)
  }

  checkUsername(username) {
    cy.get(this.usernameField).type(username, { force: true })
    cy.get(this.usernameField).should('have.value', username.substring(0, 30))
  }

  checkMaxFullName(fullName) {
    cy.get(this.fullNameField).type(fullName, { force: true })
    cy.get(this.fullNameField).should('have.value', fullName.substring(0, 260))
  }

  getFieldDescription(fieldName, searchText) {
    cy.get(`[id^="${fieldName}"`).click({ force: true, multiple: true })
    cy.get(this.descriptionField(searchText)).should('be.visible')
  }
}

export default RegisterPage
