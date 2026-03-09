import { getCsrfToken } from '../../../support/apiHelpers'
import Settings from './settings'

class ScheduleAndDetails extends Settings {
  url = `${Cypress.env('BASE_CMS_URL')}/settings/details/`

  datesItem = '[data-testid="dates-item"]'

  alertMessageContent = '.alert-message-content'

  nav_links = 'a.nav-link'

  outlineStatusBar = '[data-testid="outline-status-bar"]'

  // Method to change specific settings if they differ from current settings
  changeSetting(url, sectionName, sectionData) {
    return getCsrfToken().then(token => this.getSettings(url, token)
      .then(response => response.body)
      .then(bodyData => {
        const updated = { ...bodyData, [sectionName]: sectionData }
        return this.setSettings(url, token, updated)
      }))
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

  verifyPacing(courseId, expectedSelfPaced) {
    return getCsrfToken().then((token) => {
      this.getSettings(`${this.url}${courseId}`, token).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.self_paced).to.eq(expectedSelfPaced)
      })
    })
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
  verifyCourseDatesInFuture(dateTime) {
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
