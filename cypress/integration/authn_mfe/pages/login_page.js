class LoginPage {
  loginUser(userEmail, userPassword) {
    cy.get('#email').type(userEmail)
    cy.get('#password').type(userPassword)
    this.clickSubmit()
  }

  clickSubmit() {
    cy.get('.btn-brand').click()
  }

  dashboardMyCoursesHeader() {
    return cy.get('.header-courses')
  }

  loginFailureError() {
    return cy.get('#login-failure-alert')
  }

  forgotPasswordSuccessMessage() {
    return cy.get('#confirmation-alert')
  }
}

export default LoginPage
