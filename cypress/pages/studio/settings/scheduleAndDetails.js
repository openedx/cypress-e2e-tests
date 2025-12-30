class ScheduleAndDetails {
  url = `${Cypress.env('BASE_CMS_URL')}/settings/details/`

  datesItem = '[data-testid="dates-item"]'

  alertMessageContent = '.alert-message-content'

  datesTabLink = '#dates-tab-link'

  // Method to get domain from BASE_CMS_URL
  static getDomain() {
    const studioUrl = new URL(Cypress.env('BASE_CMS_URL'))
    return studioUrl.hostname
  }

  // Method to get CSRF token from cookies
  static getCsrfToken() {
    return cy.getAllCookies() // gets all cookies from browser
      .then(allCookiesArray => 
        allCookiesArray.find(cookieObj => 
          cookieObj.domain === this.getDomain() // filter by domain
          && cookieObj.name === 'csrftoken' // filter by cookie name
        ).value
      )
  }
  
  // Method to generate headers for requests
  headers = (refer, token) => ({
    Referer: refer,
    'X-CSRFToken': token,
    Accept: 'application/json, text/plain, */*',
  })

  // Method to get current schedule and details settings
  getSettings(url, token) {
    return cy.request({
      method: 'GET',
      url: url,
      headers: this.headers(url, token),
    })
  }

  // Method to set/update schedule and details settings
  setSettings(url, token, bodyData) {
    return cy.request({
      method: 'POST',
      url,
      headers: this.headers(url, token),
      body: bodyData,
    })
  }

  // Method to change specific settings if they differ from current settings
  changeSetting(url, sectionName, sectionData) {
    return ScheduleAndDetails.getCsrfToken()
      .then(token => {
        this.getSettings(url, token)
          .then(response => response.body)
          .then(bodyData => {
            if (bodyData[sectionName] !== sectionData) {
              bodyData[sectionName] = sectionData
              return this.setSettings(url, token, bodyData)
            }
            return false
          })
      })
  }

  // Method to set start date
  setStartDate(courseId, fieldData) {
    return this.changeSetting(`${this.url}${courseId}`, 'start_date', fieldData)
  }

  // Method to set end date
  setEndDate(courseId, fieldData) {
    return this.changeSetting(`${this.url}${courseId}`, 'end_date', fieldData)
  }

  // Method to set enrollment start date
  setEnrollmentStartDate(courseId, fieldData) {
    return this.changeSetting(`${this.url}${courseId}`, 'enrollment_start', fieldData)
  }

  // Method to set course to instructor-paced
  setInstructorPaced(courseId) {
    return this.changeSetting(`${this.url}${courseId}`, 'self_paced', false)
  }

  // Method to set course to self-paced
  setSelfPaced(courseId) {
    return this.changeSetting(`${this.url}${courseId}`, 'self_paced', true)
  }

  // Helper: Get year from ISO date
  getYear(isoDate) {
    return new Date(isoDate).getFullYear()
  }

  // Helper: Get month name from ISO date
  getMonth(isoDate) {
    return new Date(isoDate).toLocaleDateString('en-US', { month: 'short' }) // "Dec"
  }

  // Helper: Get day of month from ISO date
  getDay(isoDate) {
    return new Date(isoDate).getDate()
  }

  // Method to verify date on Dates tab in Learner view
  verifyDateonDatesTab(label, dateTime) {
    cy.contains(this.datesItem, label)
      .parent()
      .should('be.visible')
      .and('contain', this.getMonth(dateTime))
      .and('contain', this.getDay(dateTime))
      .and('contain', this.getYear(dateTime))
  }

  // Method to verify "course not yet started" message
  verifyCourseDatesinFuture(dateTime) {
    cy.get(this.alertMessageContent)
      .should('be.visible')
      .and('contain', 'Course starts in')
      .and('contain', this.getMonth(dateTime))
      .and('contain', this.getDay(dateTime))
      .and('contain', this.getYear(dateTime))
  }

  // Method to navigate to Dates tab in Learner view
  navigateToDatesTab() {
    cy.get(this.datesTabLink).should('be.visible').click()
    cy.url().should('include', '/dates')
  }
}

export default ScheduleAndDetails
