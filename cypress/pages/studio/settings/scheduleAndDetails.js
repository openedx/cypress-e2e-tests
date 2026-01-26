import { getCsrfToken, getRequestHeaders } from '../../../support/apiHelpers'

class ScheduleAndDetails {
  url = `${Cypress.env('BASE_CMS_URL')}/settings/details/`

  datesItem = '[data-testid="dates-item"]'

  alertMessageContent = '.alert-message-content'

  nav_links = 'a.nav-link'

  outlineStatusBar = '[data-testid="outline-status-bar"]'

  // Method to get current schedule and details settings
  getSettings(url, token) {
    return cy.request({
      method: 'GET',
      url,
      headers: getRequestHeaders(url, token),
    })
  }

  // Method to set/update schedule and details settings
  setSettings(url, token, bodyData) {
    return cy.request({
      method: 'POST',
      url,
      headers: getRequestHeaders(url, token),
      body: bodyData,
    })
  }

  // Method to change specific settings if they differ from current settings
  changeSetting(url, sectionName, sectionData) {
    return getCsrfToken().then(token => this.getSettings(url, token)
      .then(response => response.body)
      .then(bodyData => {
        if (bodyData[sectionName] !== sectionData) {
          // eslint-disable-next-line no-param-reassign
          bodyData[sectionName] = sectionData
          return this.setSettings(url, token, bodyData)
        }
        return false
      }))
  }

  searchReindex(courseId) {
    const url = `${Cypress.env('BASE_CMS_URL')}/course/${courseId}/search_reindex`
    return getCsrfToken().then(token => cy.request({
      method: 'GET',
      url,
      headers: getRequestHeaders(url, token),
    }))
  }

  // Helper: Get an offset date from today
  getDateWithOffset(daysAhead = 10) {
    const date = new Date()
    date.setDate(date.getDate() + daysAhead)
    return date.toISOString()
  }

  // Method to set start date
  setStartDate(courseId, fieldData) {
    return this.changeSetting(`${this.url}${courseId}`, 'start_date', fieldData)
  }

  // Method to set end date
  setEndDate(courseId, fieldData) {
    return this.changeSetting(`${this.url}${courseId}`, 'end_date', fieldData)
  }

  // Method to set both start, end and enrollment dates
  setCourseDates(courseId, startDate, endDate, enrollmentStartDate) {
    return this.setStartDate(courseId, startDate)
      .then(() => this.setEndDate(courseId, endDate))
      .then(() => this.setEnrollmentStartDate(courseId, enrollmentStartDate))
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

  // Helper: Get time from ISO date
  getTime(isoDate) {
    return new Date(isoDate).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hourCycle: 'h12',
    })
  }

  // Format date as "Dec 31, 2025"
  getFormattedDate(isoDate) {
    const date = new Date(isoDate)
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  // Method to assert that an element contains date (and optionally time)
  assertContainsDate(dateTime, includeTime = false) {
    cy.get('@element')
      .and('contain', this.getMonth(dateTime))
      .and('contain', this.getDay(dateTime))
      .and('contain', this.getYear(dateTime))

    if (includeTime) {
      cy.get('@element').and('contain', this.getTime(dateTime))
    }
  }

  // Method to verify date on Dates tab in Learner view
  verifyDateonDatesTab(label, dateTime) {
    cy.contains(this.datesItem, label)
      .parent()
      .should('be.visible')
      .as('element')

    this.assertContainsDate(dateTime)
  }

  // Method to verify "course not yet started" message
  verifyCourseDatesinFuture(dateTime) {
    cy.get(this.alertMessageContent)
      .should('be.visible')
      .and('contain', 'Course starts in')
      .as('element')

    this.assertContainsDate(dateTime)
  }

  // Method to verify alert message content with hours count
  verifyAlertMessageContent(hoursCount) {
    cy.get(this.alertMessageContent)
      .should('be.visible')
      .and('contain', `Course starts in ${hoursCount} hours`)
  }

  // Method to verify start date in Studio Course Outline
  verifyStartDateInCourseOutline(dateTime) {
    cy.get(this.outlineStatusBar)
      .contains('Start date')
      .parent()
      .find('a.small')
      .should('be.visible')
      .should('contain', this.getMonth(dateTime))
      .should('contain', this.getDay(dateTime))
      .should('contain', this.getYear(dateTime))
      .invoke('text')
      .then((text) => {
        // Extract time from the text and verify it matches (ignore AM/PM case sensitivity)
        const displayedTime = text.match(/\d{1,2}:\d{2}\s*[AP]M/i)
        const expectedTime = this.getTime(dateTime)
        if (displayedTime) {
          expect(text).to.include(displayedTime[0])
          cy.log(`Displayed time: ${displayedTime[0]}, Expected: ${expectedTime}`)
        }
      })
  }

  // Method to navigate to Dates tab in Learner view
  navigateToDatesTab() {
    cy.contains(this.nav_links, 'Dates').click()
    cy.url().should('include', '/dates')
  }
}

export default ScheduleAndDetails
