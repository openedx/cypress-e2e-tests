Cypress.on('uncaught:exception', () => false)
// returning false here prevents Cypress from
// failing the test

Cypress.Commands.add('signin', (sessionName, userEmail, userPassword, { cacheSession = true } = {}) => {
  const loginUrl = Cypress.env('loginUrl', '/login')
  const login = () => {
    cy.request({
      url: loginUrl,
      failOnStatusCode: false,
    })
    cy.getCookie('csrftoken').its('value').then(($token) => {
      cy.request({
        method: 'POST',
        url: Cypress.env('login_api_url', '/login_ajax'),
        form: true,
        body: {
          email: userEmail,
          password: userPassword,
          remember: false,
        },
        headers: {
          Referer: Cypress.config().baseUrl + loginUrl,
          'X-CSRFToken': $token,
        },
      })
    })
  }
  if (cacheSession) {
    cy.session(sessionName, login)
  } else {
    login()
  }
})

Cypress.Commands.add('changeEnrollment', (courseId, enrollmentAction) => {
  const changeEnrollUrl = Cypress.env('enroll_url', '/change_enrollment')
  cy.getCookie('csrftoken').its('value').then(($token) => {
    cy.request({
      method: 'POST',
      url: changeEnrollUrl,
      form: true,
      body: {
        course_id: courseId,
        enrollment_action: enrollmentAction,
      },
      headers: {
        Referer: Cypress.config().baseUrl + changeEnrollUrl,
        'X-CSRFToken': $token,
      },
    }).then(
      (response) => response.body.status,
    )
  })
})
