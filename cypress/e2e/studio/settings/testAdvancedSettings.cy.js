import AdvancedSettings from '../../../pages/studio/settings/advancedSettings'
import ScheduleAndDetails from '../../../pages/studio/settings/scheduleAndDetails'
import CourseDiscoveryPage from '../../../pages/lms/courseDiscoveryPage'
import { NEW_COURSE_DATA } from '../../../support/constants'// '../../../../../support/constants'

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
  const baseMFEURL = Cypress.env('BASE_MFE_URL')
  const { courseId } = NEW_COURSE_DATA

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.loginAdminLmsCms()
    cy.visit(`${baseMFEURL}/authoring/course/${courseId}`)
  })

  it.skip('Test course visibility = `none` behavior', function () {
  })

  it.skip('Test course visibility = `about` behavior', function () {
  })

  it('Test course visibility = `both` behavior', function () {
    const startDateTime = scheduleAndDetails.getDateWithOffset(0)
    const endDateTime = scheduleAndDetails.getDateWithOffset(30)

    scheduleAndDetails.setStartDate(courseId, startDateTime)
    scheduleAndDetails.setEndDate(courseId, endDateTime)

    advancedSettings.courseVisibility(courseId, 'both')

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
