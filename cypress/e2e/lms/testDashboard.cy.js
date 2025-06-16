import DashboardPage from '../../pages/lms/dashboardPage'
import DEMO_COURSE_DATA from '../../support/constants'

describe('Learner Dashboard', function () {
  const dashboardPage = new DashboardPage()

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    const baseURL = Cypress.env('BASE_MFE_URL')
    cy.visit(`${baseURL}/authn/login`)
    cy.signin('new user', Cypress.env('LMS_NEW_USER_EMAIL'), Cypress.env('LMS_NEW_USER_PASSWORD'))
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

    it('should redirect to Discover courses page and back to Dashboard', function () {
      dashboardPage.goToDiscoverPage()
    })

    // Need to check Help link
    it.skip('Help link should redirect to the docs site', function () {
    })

    // Need to check Theme toggle switch
    it('Theme toggle switch should change the theme on light/dark', function () {
      dashboardPage.checkLightDarkTheme()
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
})

describe('[TC_LEARNER_17] Manage email preferences from Learner Dashboard', function () {
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

  it('should display course email settings button and test', function () {
    if (!Cypress.env('ENABLE_BULK_EMAIL_FLAG')) {
      this.skip()
    }
    dashboardPage.getEmailSettings()
  })
})

describe('[TC_LEARNER_50] Search bar displaying for different user roles', function () {
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
    cy.window().then((win) => {
      cy.log(`sessionStorage user: ${win.sessionStorage.getItem('user')}`)
    })
    dashboardPage.getSearchBarForm().should('exist')
  })

  it('search bar is NOT displayed on the learner dashboard for common users', function () {
    cy.signin('common user', Cypress.env('LMS_USER_EMAIL'), Cypress.env('LMS_USER_PASSWORD'))
    cy.visit(`${baseURL}/learner-dashboard/`)
    dashboardPage.getSearchBarForm().should('not.exist')
  })
})

describe('Additional Dashboard Page tests', function () {
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

  it('should contain Page Header block', function () {
    dashboardPage.getPageHeader().should('exist')
  })

  it('should contain Page Footer block', function () {
    dashboardPage.getPageFooter().should('exist')
  })

  it('should contain View as form', function () {
    dashboardPage.getSearchBarForm().should('exist')
  })

  it('should contain View as label', function () {
    dashboardPage.getSearchBarLabel().should('exist')
  })

  it('should contain Submit button for View as form', function () {
    dashboardPage.getSubmitViewAsButtonExist()
  })

  it('should enable Submit button for View as form when user input', function () {
    dashboardPage.getSubmitViewAsButtonEnableWhenUserInput()
  })

  it('should submit View as form as exist learner', function () {
    dashboardPage.getSubmitAsExistLearner()
  })

  it('should render the filter controls container', () => {
    dashboardPage.getRefineButton()
  })

  it('should filter by in Progress and not show course card', () => {
    dashboardPage.getFilterByInProgress()
  })

  it('should clear all filters', () => {
    dashboardPage.getClearAllFilters()
  })

  it('should dispaly course title', () => {
    dashboardPage.getCourseTitle()
  })

  it('should display course image', () => {
    dashboardPage.getCourseImage()
  })

  it('should display course details', () => {
    dashboardPage.getCourseDetails()
  })

  it('should display alert message content on course card', () => {
    dashboardPage.getAllertMessageContent()
  })
})
