// Create a command which takes email and password and logs user in using api request
Cypress.Commands.add('login_using_api', (userEmail, userPassword) => {
  // Open the Stage login page to create session
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

Cypress.Commands.add('register_using_api', () => {
  const uuidv4 = require('uuid/v4');
  const user_string = uuidv4().substr(-11)
  const userName = `user_${user_string}`
  const userEmail = `${userName}@example.com`
  const userPassword = 'cypress101'
  // Open the Stage registration page to create session
  cy.request({
    url: Cypress.env('lms_registration_url'),
    failOnStatusCode: false,
  })
  // Save csrftoken and use it in header to send Registration Post request
  cy.getCookie('csrftoken').its('value').then(($token) => {
    cy.request({
      method: 'POST',
      url: Cypress.env('lms_registration_api_url'),
      form: true,
      body: {
        email: userEmail,
        name: userName,
        username: userName,
        password: userPassword,
        country: 'PK',
        honor_code: true
      },
      headers: {
        Referer: Cypress.env('lms_registration_url'),
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

Cypress.Commands.add('make_payment', () => {
  // Fill billing address
  cy.get('#id_first_name').type('ecom')
  cy.get('#id_last_name').type('user')
  cy.get('#id_address_line1').type('house 1, street 3')
  cy.get('#id_address_line2').type('lane 2, sector 4')
  cy.get('#id_city').type('Lahore')
  cy.get('#id_country').select('PK')
  cy.get('#id_state').type('Punjab')
  cy.get('#id_postal_code').type(54000)
  // Fill billing info
  cy.get('#card-number').type(4111111111111111)
  cy.get('#card-cvn').type(123)
  cy.get('#card-expiry-month').select('01')
  cy.get('#card-expiry-year').select('2020')
  cy.get('#payment-button').click()
})
