import AboutCoursePage from '../../pages/lms/courseAboutPage'
import DashboardPage from '../../pages/lms/dashboardPage'
import DEMO_COURSE_DATA from '../../support/constants'

describe('[TC_LEARNER_25] Course about page: enroll in a course', { tags: '@smoke' }, function () {
  const dashboardPage = new DashboardPage()
  const aboutCoursePage = new AboutCoursePage()
  const baseURL = Cypress.env('BASE_URL')
  const baseMFEURL = Cypress.env('BASE_MFE_URL')

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.visit(`${baseMFEURL}/authn/login`)
    cy.signin('test user', Cypress.env('LMS_USER_EMAIL'), Cypress.env('LMS_USER_PASSWORD'))
  })

  it('should show Enroll Now button ', function () {
    cy.visit(`${baseMFEURL}/learner-dashboard/`)
    dashboardPage.goToDiscoverPage()
    dashboardPage.selectCourse(DEMO_COURSE_DATA.courseName)
    aboutCoursePage.getEnrollNowButton().should('contain.text', 'Enroll Now')
  })

  it('should redirect user to dashboard page by clicking on the "Enroll Now" button', function () {
    cy.visit(`${baseURL}/courses/${DEMO_COURSE_DATA.courseId}/about`)
    aboutCoursePage.getEnrollNowButton().click()
    cy.url().should('include', '/learner-dashboard')
    aboutCoursePage.getCourseTitle().contains(DEMO_COURSE_DATA.courseName)
  })

  it('should display Enroll Now button as disabled after user enrolls in a course', function () {
    cy.visit(`${baseURL}/courses/${DEMO_COURSE_DATA.courseId}/about`)
    aboutCoursePage.getEnrollNowButton()
      .should('have.class', 'disabled')
      .and('contain', 'Already Enrolled')
    aboutCoursePage.getViewCourseButton().should('contain', 'View Course')
  })

  it('change enrollment status to unenroll', function () {
    cy.changeEnrollment(DEMO_COURSE_DATA.courseId, 'unenroll')
  })
})

describe('About course page tests for Staff', function () {
  const aboutCoursePage = new AboutCoursePage()

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    const baseMFEURL = Cypress.env('BASE_MFE_URL')
    const baseURL = Cypress.env('BASE_URL')
    cy.visit(`${baseMFEURL}/authn/login`)
    cy.signin('staff', Cypress.env('ADMIN_USER_EMAIL'), Cypress.env('ADMIN_USER_PASSWORD'))
    cy.visit(`${baseURL}/courses/${DEMO_COURSE_DATA.courseId}/about`)
  })

  describe('[TC_LEARNER_26] Course about page: share course by Facebook', { tags: '@regression' }, function () {
    it('should visible facebook icon', function () {
      aboutCoursePage.getIconFacebook().should('be.visible')
    })

    it('should redirect to facebook', function () {
      aboutCoursePage.getIconFacebook().click()
      cy.url().should('include', 'facebook.com')
    })
  })

  describe('[TC_LEARNER_27] Course about page: share course by Twitter', { tags: '@regression' }, function () {
    it('should visible twitter icon', function () {
      aboutCoursePage.getIconTwitter().should('be.visible')
    })

    it('should redirect to twitter', function () {
      aboutCoursePage.getIconTwitter().click()
      cy.url().should('include', 'x.com')
    })
  })

  describe('[TC_LEARNER_28] Course about page: share course by email', { tags: '@regression' }, function () {
    it('should visible mail icon', function () {
      aboutCoursePage.getIconMail().should('be.visible')
    })
  })

  describe('[TC_LEARNER_29] Course about page: start date format', { tags: '@regression' }, function () {
    it('should visible classes start date', function () {
      aboutCoursePage.getClassesStart().should('be.visible')
    })

    it('should display start date in correct format', function () {
      aboutCoursePage.checkClassesStartDateFormat()
    })
  })

  describe('[TC_LEARNER_31] Course about page: course image & video', { tags: '@regression' }, function () {
    it('should visible course image', function () {
      aboutCoursePage.getCourseImage().should('be.visible')
    })

    // Skipping the video test as it requires a specific setup or content
    it.skip('should display course video', function () {
    })
  })
})

describe('About course page tests for Not authorized user', { tags: '@regression' }, function () {
  const aboutCoursePage = new AboutCoursePage()

  beforeEach(function () {
    const baseURL = Cypress.env('BASE_URL')
    cy.visit(`${baseURL}/courses/${DEMO_COURSE_DATA.courseId}/about`)
  })

  it('should display course name', function () {
    aboutCoursePage.checkCourseName(DEMO_COURSE_DATA.courseName)
  })

  it('should display Enroll Now button', function () {
    aboutCoursePage.getEnrollNowButton().should('contain.text', 'Enroll Now')
  })

  it('should visible facebook icon', function () {
    aboutCoursePage.getIconFacebook().should('be.visible')
  })

  it('should redirect to facebook', function () {
    aboutCoursePage.getIconFacebook().click()
    cy.url().should('include', 'facebook.com')
  })

  it('should visible twitter icon', function () {
    aboutCoursePage.getIconTwitter().should('be.visible')
  })

  it('should redirect to twitter', function () {
    aboutCoursePage.getIconTwitter().click()
    cy.url().should('include', 'x.com')
  })

  it('should visible mail icon', function () {
    aboutCoursePage.getIconMail().should('be.visible')
  })

  it('should visible classes start date', function () {
    aboutCoursePage.getClassesStart().should('be.visible')
  })

  it('should redirect to login by clicking on the "Enroll Now" button', function () {
    aboutCoursePage.getEnrollNowButton().click()
    cy.url().should('include', '/authn/login')
  })
})
