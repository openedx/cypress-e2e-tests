import DashboardPage from '../../../pages/lms/dashboardPage'

describe('[TC_LEARNER_6D] Header slot on the Courses Home page for logged in user', function () {
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
    dashboardPage.checkHeaderLinks()
  })

  it('should redirect to Discover courses page and back to Dashboard', function () {
    dashboardPage.goToDiscoverPage()
    dashboardPage.goToDashboardPage()
  })

  it('should contain account dropdown options ', function () {
    dashboardPage.checkHeaderDropdownMenu()
  })

  it('should redirect to Profile page from dropdown menu', function () {
    dashboardPage.goToProfilePageFromDropdown()
  })

  it('should redirect to Dashboard page from dropdown menu', function () {
    dashboardPage.goToProfilePageFromDropdown()
    dashboardPage.goToDashboardPageFromDropdown()
  })

  it('should redirect to Account page from dropdown menu', function () {
    dashboardPage.goToAccountPageFromDropdown()
    dashboardPage.goToDashboardPageFromDropdown()
  })  

  it('should redirect to the LMS logged out landing page from dropdown menu', function () {
    dashboardPage.signoutUser()
  })
})

describe('[TC_LEARNER_32] Tabs visible', function () {
  it.skip('Course tab is showing correctly', function () {
  })

  it.skip('Progress tab is showing correctly', function () {
  })

  it.skip('Dates tab is showing correctly', function () {
  })

  it.skip('Discussion tab is showing correctly', function () {
  })

  it.skip('Wiki tab is showing correctly (or can be added with success)', function () {
  })
})

describe('[TC_LEARNER_33] Course outline on already enrolled course', function () {
  it.skip('user can view course outline for a course they have enrolled in', function () {
  })
})

describe('[TC_LEARNER_35] Course handouts visible', function () {
  it.skip('user can view course handouts', function () {
  })
})

describe('[TC_LEARNER_36] Course resume', function () {
  it.skip('resume course button goes to most recent completed block', function () {
  })
})

describe('[TC_LEARNER_48] Automatic effort estimates for subsections', function () {
  it.skip('outline shows automatic effort estimates for subsections (e.g. 1 min, 3 min, 5 min, etc)', () => {
  })
})
