import AdvancedSettings from '../../../pages/studio/settings/advancedSettings'
import ScheduleAndDetails from '../../../pages/studio/settings/scheduleAndDetails'
import CourseDiscoveryPage from '../../../pages/lms/courseDiscoveryPage'
import CourseAboutPage from '../../../pages/lms/courseAboutPage'
import { NEW_COURSE_DATA } from '../../../support/constants'

describe('[TC_AUTHOR_131] Course display name', function () {
  it.skip('Course display name (remember to reindex course in /courses page)', () => {
  })
})

describe('[TC_AUTHOR_132] Course maximum student enrollment', function () {
  it.skip('Course maximum student enrollment', () => {
  })
})

describe('[TC_AUTHOR_133] Test course visibility in catalog', { tags: '@smoke' }, function () {
  const advancedSettings = new AdvancedSettings()
  const scheduleAndDetails = new ScheduleAndDetails()
  const courseDiscoveryPage = new CourseDiscoveryPage()
  const aboutCoursePage = new CourseAboutPage()
  const baseMFEURL = Cypress.env('BASE_MFE_URL')
  const { courseId } = NEW_COURSE_DATA
  let startDateTime
  let endDateTime
  let startEnrollDateTime

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.loginAdminLmsCms()
    cy.visit(`${baseMFEURL}/authoring/course/${courseId}`)

    // Set course dates for all tests
    startDateTime = scheduleAndDetails.getDateWithOffset(0)
    endDateTime = scheduleAndDetails.getDateWithOffset(30)
    startEnrollDateTime = scheduleAndDetails.getDateWithOffset(-1)
    scheduleAndDetails.setCourseDates(courseId, startDateTime, endDateTime, startEnrollDateTime)
  })

  it('Test course visibility = `none` behavior', function () {
    advancedSettings.courseVisibility(courseId, 'none')
      .then(() => scheduleAndDetails.searchReindex(courseId))
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      .then(() => cy.wait(2000)) // reduce flakiness
      .then(() => {
        cy.clearAllCookies()
        cy.signin('test user', Cypress.env('LMS_USER_EMAIL'), Cypress.env('LMS_USER_PASSWORD'))
        cy.visit('/courses/')
        courseDiscoveryPage.searchCourse(NEW_COURSE_DATA.courseName).then(() => {
          courseDiscoveryPage.getCourseNotExists(NEW_COURSE_DATA.courseName)
        })
      })
  })

  it('Test course visibility = `about` behavior', function () {
    advancedSettings.courseVisibility(courseId, 'about')
      .then(() => scheduleAndDetails.searchReindex(courseId))
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      .then(() => cy.wait(2000)) // reduce flakiness
      .then(() => {
        cy.clearAllCookies()
        cy.signin('test user', Cypress.env('LMS_USER_EMAIL'), Cypress.env('LMS_USER_PASSWORD'))
        cy.visit('/courses/')
        courseDiscoveryPage.searchCourse(NEW_COURSE_DATA.courseName).then(() => {
          courseDiscoveryPage.getCourseNotExists(NEW_COURSE_DATA.courseName)
          cy.visit(`/courses/${courseId}/about`)
          aboutCoursePage.checkCourseName(NEW_COURSE_DATA.courseName)
          aboutCoursePage.getEnrollNowButton()
            .should('contain.text', 'Enroll Now')
        })
      })
  })

  it('Test course visibility = `both` behavior', function () {
    advancedSettings.courseVisibility(courseId, 'both')
      .then(() => scheduleAndDetails.searchReindex(courseId))
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      .then(() => cy.wait(2000)) // reduce flakiness
      .then(() => {
        cy.clearAllCookies()
        cy.signin('test user', Cypress.env('LMS_USER_EMAIL'), Cypress.env('LMS_USER_PASSWORD'))
        cy.visit('/courses/')
        const formattedDate = scheduleAndDetails.getFormattedDate(startDateTime)
        courseDiscoveryPage.searchCourse(NEW_COURSE_DATA.courseName).then(() => {
          courseDiscoveryPage.verifyCourseAfterSearch(
            NEW_COURSE_DATA.courseName,
            NEW_COURSE_DATA.courseOrg,
            NEW_COURSE_DATA.courseCode,
            formattedDate,
          )
          courseDiscoveryPage.selectCourse(NEW_COURSE_DATA.courseName)
          cy.url().should('include', `/courses/${courseId}/about`)
        })
      })
  })
})

describe('[TC_AUTHOR_136] Enable subsection prerequisites', function () {
  it.skip('Enable subsection prerequisites', function () {
  })
})

describe('[TC_AUTHOR_137] Invitation only', function () {
  it.skip('Invitation only', function () {
  })
})

describe('[TC_AUTHOR_138] Mobile course available', function () {
  it.skip('Mobile course available', function () {
  })
})

describe('[TC_AUTHOR_139] Show calculator', function () {
  it.skip('Show calculator', function () {
  })
})

describe('[TC_AUTHOR_140] "Teams" option in the course menu (LMS)', function () {
  it.skip('should show the topics configured in the Teams configuration', function () {
  })
})
