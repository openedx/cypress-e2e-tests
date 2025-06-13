import DashboardPage from '../../pages/lms/dashboardPage'
import DEMO_COURSE_DATA from '../../support/constants'

describe('Learner Dashboard (User is logged in)', function () {
  const dashboardPage = new DashboardPage()

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    const baseURL = Cypress.env('BASE_MFE_URL')
    cy.visit(`${baseURL}/authn/login`)
    cy.login('staff', Cypress.env('LMS_USER_EMAIL'), Cypress.env('LMS_USER_PASSWORD'))
    cy.visit(`${baseURL}/learner-dashboard/`)
  })

  describe('[TC_LEARNER_6F] Header slot on the learner dashboard', function () {
    it('should contain Page Header block', function () {
      dashboardPage.getPageHeader()
      dashboardPage.checkHeaderLinks()
      dashboardPage.checkHeaderDropdownMenu()
    })

    it('should redirect to Programs page and back to Dashboard', function () {
      dashboardPage.goToProgramsPage()
      dashboardPage.goToDashboardPage()
    })

    // Need to check Discover New link
    it.skip('should redirect to Discover courses page and back to Dashboard', function () {
    })

    // Need to check Help link
    it.skip('Help link should redirect to the docs site', function () {
    })

    // Need to check Theme toggle switch
    it.skip('Theme toggle switch should change the theme on light/dark', function () {
    })
  })

  describe('[TC_LEARNER_14] Enrolled courses amount', function () {
    it.skip('User enrolled in one or more courses sees all of the courses they have enrolled in on the Course Dashboard', function () {
    })
  })

  describe('[TC_LEARNER_15] View course button', function () {
    it.skip('view course button', function () {
    })
  })

  describe('[TC_LEARNER_16] Enroll/Unenroll from course from Learner Dashboard', function () {
    it('user enrolls in a course from Learner Dashboard', function () {
      dashboardPage.getCourseAndEnroll(DEMO_COURSE_DATA.courseName)
    })

    it('user enrolled in a course can cancel unenroll request', function () {
      dashboardPage.getDisplayUnenrollButtonAndCancel()
    })

    it('user enrolled in a course can unenroll from course from Learner Dashboard', function () {
      dashboardPage.courseUnenroll()
    })
  })

  describe('[TC_LEARNER_17] Manage email preferences from Learner Dashboard', function () {
    it.skip('user can manage email preferences for a course from Learner Dashboard', function () {
    })
  })

  describe('[TC_LEARNER_50] Search bar displaying', function () {
    it.skip('search bar is displayed on the learner dashboard only for staff users', function () {
    })
  })
})
