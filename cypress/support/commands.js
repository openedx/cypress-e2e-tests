const uuidv4 = require('uuid/v4')

// Create a command which takes email and password and logs user in using api request
Cypress.Commands.add('login_using_api', (userEmail, userPassword) => {
  // Open the Stage login page to create session
  cy.request({
    url: Cypress.env('login_url'),
    failOnStatusCode: false,
  })
  // Save csrftoken and use it in header to send Login Post request
  cy.getCookie('csrftoken').its('value').then(($token) => {
    cy.request({
      method: 'POST',
      url: Cypress.env('login_api_url'),
      form: true,
      body: {
        email: userEmail,
        password: userPassword,
        remember: false,
      },
      headers: {
        Referer: Cypress.env('login_url'),
        'X-CSRFToken': $token,
      },
    })
  })
})

Cypress.Commands.add('register_using_api', () => {
  const randomString = uuidv4().substr(-11)
  const userName = `user_${randomString}`
  const userEmail = `${userName}@example.com`
  const userPassword = 'cypress101'
  // Open the Stage registration page to create session
  cy.request({
    url: Cypress.env('registration_url'),
    failOnStatusCode: false,
  })
  // Save csrftoken and use it in header to send Registration Post request
  cy.getCookie('csrftoken').its('value').then(($token) => {
    cy.request({
      method: 'POST',
      url: Cypress.env('registration_api_url'),
      form: true,
      body: {
        email: userEmail,
        name: userName,
        username: userName,
        password: userPassword,
        level_of_education: Cypress.env('level_of_education'),
        gender: Cypress.env('gender'),
        year_of_birth: Cypress.env('year_of_birth'),
        mailing_address: Cypress.env('mailing_address'),
        goals: Cypress.env('goals'),
        first_name: Cypress.env('first_name'),
        last_name: Cypress.env('last_name'),
        state: Cypress.env('state'),
        country: Cypress.env('country'),
        company: Cypress.env('company'),
        title: Cypress.env('title'),
        terms_of_service: Cypress.env('terms_of_service'),
        honor_code: Cypress.env('honor_code'),
      },
      headers: {
        Referer: Cypress.env('registration_url'),
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
  cy.get('.header-actions .btn').then(($btn) => {
    if ($btn.text() === 'Login') {
      cy.wrap($btn).click()
    }
  })
})

Cypress.Commands.add('make_payment', () => {
  // Fill billing address
  cy.get('#id_first_name').type(Cypress.env('id_first_name'))
  cy.get('#id_last_name').type(Cypress.env('id_last_name'))
  cy.get('#id_address_line1').type(Cypress.env('id_address_line1'))
  cy.get('#id_address_line2').type(Cypress.env('id_address_line2'))
  cy.get('#id_city').type(Cypress.env('id_city'))
  cy.get('#id_country').select(Cypress.env('id_country'))
  cy.get('#id_state').type(Cypress.env('id_state'))
  cy.get('#id_postal_code').type(Cypress.env('id_postal_code'))
  // Fill billing info
  cy.get('#card-number').type(Cypress.env('card-number'))
  cy.get('#card-cvn').type(Cypress.env('card-cvn'))
  cy.get('#card-expiry-month').select(Cypress.env('card-expiry-month'))
  cy.get('#card-expiry-year').select(Cypress.env('card-expiry-year'))
  cy.get('#payment-button').click()
})

Cypress.Commands.add('check_labels', (css, labelsToCheck) => {
  // Check labels in a list
  cy.get(css).each(($el, index) => {
    const options = labelsToCheck
    cy.wrap($el[index]).contains((options[index])).should((elem) => {
      expect(elem.text()).to.equal(options[index])
    })
  })
})

Cypress.Commands.add('upload_file', (fileName, fileType = ' ', selector) =>
  cy.get(selector).then((subject) => {
    cy.fixture(fileName, 'base64')
      .then(Cypress.Blob.base64StringToBlob)
      .then((blob) => {
        const el = subject[0]
        const testFile = new File([blob], fileName, {
          type: fileType,
        })
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(testFile)
        el.files = dataTransfer.files
      })
  }))
