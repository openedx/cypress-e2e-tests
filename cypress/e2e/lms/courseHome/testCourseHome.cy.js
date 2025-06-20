import CourseHomePage from '../../../pages/lms/courseHome/courseHomePage'
import DEMO_COURSE_DATA from '../../../support/constants'

describe('[TC_LEARNER_6D] Header slot on the Courses Home page for logged in user', function () {
  it.skip('should contain Page Header block', function () {
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

describe('[TC_LEARNER_33] Course outline on already enrolled course', { tags: '@smoke' }, function () {
  const courseHomePage = new CourseHomePage()
  const baseMFEURL = Cypress.env('BASE_MFE_URL')

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.visit(`${baseMFEURL}/authn/login`)
    cy.signin('test user', Cypress.env('LMS_USER_EMAIL'), Cypress.env('LMS_USER_PASSWORD'))
    cy.changeEnrollment(DEMO_COURSE_DATA.courseId, 'enroll')
    cy.visit(`${baseMFEURL}/learner-dashboard/`)
  })

  afterEach(function () {
    cy.changeEnrollment(DEMO_COURSE_DATA.courseId, 'unenroll')
  })

  it('user can view course outline for a course', function () {
    courseHomePage.getCourseTitle(DEMO_COURSE_DATA.courseName).click()
    cy.url().should('include', `/learning/course/${DEMO_COURSE_DATA.courseId}/home`)
    courseHomePage.getCourseOutline().should('be.visible')
    courseHomePage.checkSections()
    courseHomePage.checkExpandAll()
    courseHomePage.checkCollapseAll()
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
