export class LoginPage {
  loginUser(userEmail: string, userPassword: string) {
    cy.get('#login-email').type(userEmail)
    cy.get('#login-password').type(userPassword)
    cy.get('.action').should('have.text', 'Sign in').click()
  }
}
