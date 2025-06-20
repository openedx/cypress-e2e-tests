import CourseDiscoveryPage from '../../pages/lms/courseDiscoveryPage'
import DEMO_COURSE_DATA from '../../support/constants'

describe('[TC_LEARNER_5A] Course discovery page for logged out user', function () {
  it.skip('logged out user can navigate to and view the Course catalog page', function () {
  })
})

describe('[TC_LEARNER_5B] Course discovery page for logged in user', function () {
  it.skip('logged in user can navigate to and view the Course catalog page', function () {
  })
})

describe('Course Catalog page tests', function () {
  const courseDiscoveryPage = new CourseDiscoveryPage()

  const baseURL = Cypress.env('BASE_URL')
  const baseMFEURL = Cypress.env('BASE_MFE_URL')

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.visit(`${baseMFEURL}/authn/login`)
    cy.signin('test user', Cypress.env('LMS_USER_EMAIL'), Cypress.env('LMS_USER_PASSWORD'))
    cy.visit(`${baseURL}/courses/`)
  })

  describe('[TC_LEARNER_5C] Explore courses search bar', { tags: '@smoke' }, function () {
    it('should check prepopulating search bar behaviour', function () {
      courseDiscoveryPage.getSearchBar().should('be.visible')
      courseDiscoveryPage.checkPlaceholder()
      courseDiscoveryPage.getSearchBar().click().type('a')
      courseDiscoveryPage.getSearchBar().should('have.value', 'a')
    })

    it('check the search for Course Catalog Page (positive)', function () {
      courseDiscoveryPage.searchCourse(DEMO_COURSE_DATA.courseName)
      // Verify that the search results contain the expected course
      courseDiscoveryPage.verifyCourseAfterSearch(
        DEMO_COURSE_DATA.courseName,
        DEMO_COURSE_DATA.courseOrg,
        DEMO_COURSE_DATA.courseCode,
        DEMO_COURSE_DATA.courseStartDate,
      )
      courseDiscoveryPage.checkDiscoveryMessageCounter()
      courseDiscoveryPage.clearSearch()
    })

    it('check the search for Course Catalog Page (negative)', function () {
      const searchString = 'NonExistentCourse'
      courseDiscoveryPage.searchCourse(searchString)
      courseDiscoveryPage.getDiscoveryMessage().should('contain', `We couldn't find any results for "${searchString}".`)
    })
  })

  describe('[TC_LEARNER_6A] Filter courses using search bar', function () {
    it.skip('learner can filter courses using the search bar on the Course Catalog page', function () {
    })
  })

  describe('[TC_LEARNER_6B] Course links redirect user to course About page', { tags: '@smoke' }, function () {
    it('course links on the Course catalog page work when clicked', function () {
      courseDiscoveryPage.selectCourse(DEMO_COURSE_DATA.courseName)
      cy.url().should('include', `/courses/${DEMO_COURSE_DATA.courseId}/about`)
    })
  })
})
