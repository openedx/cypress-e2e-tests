// Create a command which takes email and password and logs user in using api request
Cypress.Commands.add('login_using_api', (userEmail, userPassword) => {
  // Open the Stage landing page to create session
  cy.request({
    url: Cypress.env('lms_login_url'),
    failOnStatusCode: false,
  })
  // Save csrftoken and use it in header to send Login Post request
  cy.getCookie('csrftoken').its('value').then(($token) => {
    cy.request({
      method: 'POST',
      url: Cypress.env('lms_login_api_url'),
      form: true,
      body: {
        email: userEmail,
        password: userPassword,
        remember: false,
      },
      headers: {
        Referer: Cypress.env('lms_login_url'),
        'X-CSRFToken': $token,
      },
    })
  })
})

Cypress.Commands.add('login_from_ui', (userEmail, userPassword) => {
  // Click on the login button and provide email and password to log in
  cy.get('.header-actions > .btn').contains('Login').click()
  cy.get('#login-email').type(userEmail)
  cy.get('#login-password').type(userPassword)
  cy.get('.action').should('have.text', 'Sign in').click()
  cy.get('.account-info').should('exist')
})
