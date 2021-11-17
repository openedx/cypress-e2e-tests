class LoginPage {
  loginUser(userEmail, userPassword) {
    cy.get('#login-email').type(userEmail)
    cy.get('#login-password').type(userPassword)
    cy.get('.action').should('have.text', 'Sign in').click()
  }
}

export default LoginPage
