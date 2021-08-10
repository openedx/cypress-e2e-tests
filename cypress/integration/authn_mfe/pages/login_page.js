class LoginPage {
  loginUser(userEmail, userPassword) {
    cy.get('#emailOrUsername').type(userEmail)
    cy.get('#password').type(userPassword)
    this.clickSubmit()
  }

  clickSubmit() {
    cy.get('.btn-brand').click()
  }

  dashboardMyCoursesHeader() {
    return cy.get('.header-courses')
  }

  welcomePageHeading() {
    return cy.get('.welcome-page-heading')
  }

  loginFailureError() {
    return cy.get('#login-failure-alert')
  }
}

export default LoginPage
