class LoginPage {
  loginUser(userEmail, userPassword) {
    cy.get('#emailOrUsername').type(userEmail)
    cy.get('#password').type(userPassword)
    this.clickSubmit()
  }

  checkLoginFormStructure() {
    cy.get('#emailOrUsername').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('.btn-brand').should('be.visible')
    cy.get('#forgot-password').should('be.visible')
  }

  clickSubmit() {
    cy.get('.btn-brand').click()
  }

  getDashboardMyCoursesHeader() {
    return cy.get('.header-courses')
  }

  getWelcomePageHeading() {
    return cy.get('.welcome-page-heading')
  }

  getLoginFailureError() {
    return cy.get('#login-failure-alert')
  }
}

export default LoginPage
