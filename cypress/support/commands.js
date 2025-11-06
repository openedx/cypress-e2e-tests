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

Cypress.Commands.add('loginAdmin', (sessionName = 'staff', { cacheSession = true } = {}) => {
  cy.signin(sessionName, Cypress.env('ADMIN_USER_EMAIL'), Cypress.env('ADMIN_USER_PASSWORD'), cacheSession)
})

Cypress.Commands.add('loginAdminLmsCms', (sessionName = 'staffCMS', { cacheSession = true } = {}) => {
  const login = () => {
    cy.session('staffCMS', () => {
      cy.loginAdmin()
      cy.visit({ url: Cypress.env('BASE_CMS_URL'), method: 'GET' }).then(() => {
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

Cypress.Commands.add('createEmptyCourse', (courseData) => {
  const createCourseUrl = Cypress.env('course_url', '/course')
  cy.getCookie('csrftoken').its('value').then(($token) => {
    cy.request({
      method: 'POST',
      url: createCourseUrl,
      body: courseData,
      headers: {
        'X-CSRFToken': $token,
        Referer: Cypress.config().baseUrl,
        'Content-Type': 'application/json',
      },
    }).then(
      (response) => response.body.status,
    )
  })
})

Cypress.Commands.add('deleteXBlock', (blockLocator) => {
  cy.log(`Deleting XBlock with locator: ${blockLocator}`)
  // const deleteUrl = `${Cypress.env('BASE_CMS_URL')}/xblock/${blockLocator}`
  const deleteXBlockUrl = Cypress.env('delete_xblock_url', '/xblock')
  const deleteUrl = `${deleteXBlockUrl}/${blockLocator}`
  cy.getCookie('csrftoken').its('value').then(($token) => {
    cy.request({
      method: 'DELETE',
      url: deleteUrl,
      headers: {
        'X-CSRFToken': $token,
        Referer: Cypress.config().baseUrl,
      },
    }).then(
      (response) => response.status,
    )
  })
})
