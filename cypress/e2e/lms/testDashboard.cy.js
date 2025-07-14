import DashboardPage from '../../pages/lms/dashboardPage'
import { DEMO_COURSE_DATA } from '../../support/constants'

describe('Learner Dashboard for learner', function () {
  const dashboardPage = new DashboardPage()
  const baseURL = Cypress.env('BASE_MFE_URL')

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.visit(`${baseURL}/authn/login`)
    cy.signin('test user', Cypress.env('LMS_USER_EMAIL'), Cypress.env('LMS_USER_PASSWORD'))
    cy.visit(`${baseURL}/learner-dashboard/`)
  })

  // 'Explore courses' button is available for Users without enrolled courses
  describe('[TC_LEARNER_16] Unenroll from course from Learner Dashboard', { tags: '@regression' }, function () {
    it('user should be enrolled on at least one course', function () {
      cy.changeEnrollment(DEMO_COURSE_DATA.courseId, 'enroll')
    })

    it('user enrolled in a course can cancel unenroll request', function () {
      dashboardPage.getDisplayUnenrollButtonAndCancel()
      cy.url().should('include', `${baseURL}/learner-dashboard/`)
    })

    it('user enrolled in a course can unenroll from course from Learner Dashboard', function () {
      dashboardPage.courseUnenroll()
    })
  })

  describe('[TC_LEARNER_6F] Header slot on the learner dashboard', { tags: '@regression' }, function () {
    it('should contain Page Header block', function () {
      dashboardPage.getPageHeader().should('exist')
    })

    it('should contain Page Footer block', function () {
      dashboardPage.getPageFooter().should('exist')
    })

    it('should contain main header links', function () {
      dashboardPage.checkHeaderLinks()
      dashboardPage.checkHeaderDropdownMenu()
    })

    it('should redirect to Programs page and back to Dashboard', function () {
      dashboardPage.goToProgramsPage()
      dashboardPage.goToDashboardPage()
    })

    it('should redirect to Discover courses page and back to Dashboard', function () {
      dashboardPage.goToDiscoverPage()
      dashboardPage.goToDashboardPage()
    })

    it('Help link should redirect to the docs site', function () {
      if (!Cypress.env('ENABLE_SUPPORT_URL')) {
        this.skip()
      }
      dashboardPage.getHelpLink().click()
      cy.url().should('include', 'edx.readthedocs.io/projects/open-edx-learner-guide')
    })

    it('Theme toggle switch should change the theme on light/dark', function () {
      dashboardPage.checkLightDarkTheme()
    })
  })
})

describe('Learner Dashboard for Staff', function () {
  const dashboardPage = new DashboardPage()

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    const baseURL = Cypress.env('BASE_MFE_URL')
    cy.visit(`${baseURL}/authn/login`)
    cy.signin('staff', Cypress.env('ADMIN_USER_EMAIL'), Cypress.env('ADMIN_USER_PASSWORD'))
    cy.visit(`${baseURL}/learner-dashboard/`)
  })

  // User should be enrolled for at least one course
  describe('[TC_LEARNER_15] View course button', { tags: '@regression' }, function () {
    it('view course button', function () {
      dashboardPage.checkViewCourseButtons(['Begin Course', 'View Course', 'Resume'])
    })
  })

  // Ensure bulk email flag is enabled for test this and use ENABLE_BULK_EMAIL_FLAG
  describe('[TC_LEARNER_17] Manage email preferences from Learner Dashboard', { tags: '@regression' }, function () {
    it('should display course email settings button and test', function () {
      if (!Cypress.env('ENABLE_BULK_EMAIL_FLAG')) {
        this.skip()
      }
      dashboardPage.getEmailSettings()
    })
  })

  // Check base elements on the Dashboard page
  describe('[TC_LEARNER_14] General check of My Courses block', { tags: '@smoke' }, function () {
    it('should dispaly course title', () => {
      dashboardPage.checkCourseTitle()
    })

    it('should display course image', () => {
      dashboardPage.checkCourseImage()
    })

    it('should display course details', () => {
      dashboardPage.checkCourseDetails()
    })

    it('should display alert message content on course card', () => {
      dashboardPage.checkAllertMessageContent()
    })

    it('should render the filter controls container', () => {
      dashboardPage.getRefineButton()
    })

    it('should filter courses displayed by Course Status', () => {
      dashboardPage.checkFilterByCourseStatus()
    })

    it('should clear all filters', () => {
      dashboardPage.clearAllFilters()
    })

    it('should sort courses displayed by Enrollment date or Title', () => {
      dashboardPage.checkSortCourses()
    })

    it('view course buttons', function () {
      dashboardPage.checkViewCourseButtons(['Begin Course', 'View Course', 'Resume'])
    })

    it('should redirect user to course outline page', function () {
      dashboardPage.checkCourseLearningPage()
    })
  })
})

// Search bar is displayed on the learner dashboard only for staff users
describe('[TC_LEARNER_50] Search bar displaying', { tags: '@regression' }, function () {
  const dashboardPage = new DashboardPage()
  const baseURL = Cypress.env('BASE_MFE_URL')

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.visit(`${baseURL}/authn/login`)
  })

  it('search bar is displayed on the learner dashboard for staff users', function () {
    cy.signin('staff', Cypress.env('ADMIN_USER_EMAIL'), Cypress.env('ADMIN_USER_PASSWORD'))
    cy.visit(`${baseURL}/learner-dashboard/`)
    dashboardPage.getSearchBarForm().should('exist')
    dashboardPage.getSearchBarLabel().should('exist')
    dashboardPage.getSubmitViewAsButtonExist()
    dashboardPage.getSubmitViewAsButtonEnableWhenUserInput()
    dashboardPage.getSubmitAsExistLearner()
  })

  it('search bar is NOT displayed on the learner dashboard for common users', function () {
    cy.signin('common user', Cypress.env('LMS_USER_EMAIL'), Cypress.env('LMS_USER_PASSWORD'))
    cy.visit(`${baseURL}/learner-dashboard/`)
    dashboardPage.getSearchBarForm().should('not.exist')
  })
})
