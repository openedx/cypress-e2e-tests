import ScheduleAndDetails from '../../../pages/studio/settings/scheduleAndDetails'
import AboutCoursePage from '../../../pages/lms/courseAboutPage'
import { getCsrfToken } from '../../../support/apiHelpers'
import { NEW_COURSE_DATA } from '../../../support/constants'

describe('Schedule and Details Tests', function () {
  const scheduleAndDetails = new ScheduleAndDetails()
  const aboutCoursePage = new AboutCoursePage()
  const baseMFEURL = Cypress.env('BASE_MFE_URL')
  const { courseId } = NEW_COURSE_DATA
  const settingsUrl = `${scheduleAndDetails.url}${courseId}`

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.loginAdminLmsCms()
    cy.visit(`${baseMFEURL}/authoring/course/${courseId}`)
  })

  describe('[TC_AUTHOR_106] Set pacing to instructor paced', { tags: '@regression' }, function () {
    it('Set pacing to instructor paced', function () {
      scheduleAndDetails.setStartDate(courseId, scheduleAndDetails.getDateWithOffset())
      scheduleAndDetails.setInstructorPaced(courseId)

      // Verify the pacing is set to instructor paced
      getCsrfToken().then((token) => {
        scheduleAndDetails.getSettings(settingsUrl, token).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.self_paced).to.eq(false)
          cy.log('Course pacing set to instructor-paced successfully')
        })
      })
    })
  })

  describe('[TC_AUTHOR_107] Set pacing to self paced', { tags: '@regression' }, function () {
    it('Set pacing to self paced', function () {
      scheduleAndDetails.setStartDate(courseId, scheduleAndDetails.getDateWithOffset())
      scheduleAndDetails.setSelfPaced(courseId)

      // Verify the pacing is set to self paced
      getCsrfToken().then((token) => {
        scheduleAndDetails.getSettings(settingsUrl, token).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.self_paced).to.eq(true)
          cy.log('Course pacing set to self-paced successfully')
        })
      })
    })
  })

  describe('[TC_AUTHOR_108] Set start date and end date', { tags: '@regression' }, function () {
    it('Correct start & end dates appear on the course About page', function () {
      const startDateTime = scheduleAndDetails.getDateWithOffset(0)
      const endDateTime = scheduleAndDetails.getDateWithOffset(30)

      scheduleAndDetails.setStartDate(courseId, startDateTime)
      scheduleAndDetails.setEndDate(courseId, endDateTime)

      cy.visit(`/courses/${courseId}/about`)
      aboutCoursePage.verifyStartDate(startDateTime)
      aboutCoursePage.verifyEndDate(endDateTime)
    })

    it('Correct start & end dates appear in the Learner view in the courseware on the Dates tab', function () {
      const startDateTime = scheduleAndDetails.getDateWithOffset(0)
      const endDateTime = scheduleAndDetails.getDateWithOffset(30)

      scheduleAndDetails.setStartDate(courseId, startDateTime)
      scheduleAndDetails.setEndDate(courseId, endDateTime)

      cy.visit(`${baseMFEURL}/learning/course/${courseId}/dates`)
      // Verify course start date on Dates tab in LMS
      scheduleAndDetails.verifyDateonDatesTab('Course starts', startDateTime)
      // Verify course end date on Dates tab in LMS
      scheduleAndDetails.verifyDateonDatesTab('Course ends', endDateTime)
    })

    it('Set the start date in the future and verify a student cannot yet see courseware', function () {
      const futureStartDateTime = scheduleAndDetails.getDateWithOffset(10) // 10 days in the future

      scheduleAndDetails.setStartDate(courseId, futureStartDateTime)
      cy.visit(`${baseMFEURL}/learning/course/${courseId}/home`)

      // Verify the alert message on about page that course not yet started is displayed
      scheduleAndDetails.verifyCourseDatesinFuture(futureStartDateTime)
    })

    it('Set the start date in the past and verify a student can see courseware', function () {
      const pastStartDateTime = scheduleAndDetails.getDateWithOffset(-10) // 10 days in the past

      scheduleAndDetails.setStartDate(courseId, pastStartDateTime)
      cy.visit(`${baseMFEURL}/learning/course/${courseId}/home`)

      // Verify that the course content is accessible
      cy.contains('Begin your course today').should('be.visible')
      scheduleAndDetails.navigateToDatesTab()
      // Verify course start date in the past on Dates tab in LMS
      scheduleAndDetails.verifyDateonDatesTab('Course starts', pastStartDateTime)
    })

    it('Set the end date in the past and verify the course is now archived', function () {
      const startDateTime = scheduleAndDetails.getDateWithOffset(-10) // 1 day in the past
      const endDateTime = scheduleAndDetails.getDateWithOffset(-1) // 1 day in the past

      scheduleAndDetails.setStartDate(courseId, startDateTime)
      scheduleAndDetails.setEndDate(courseId, endDateTime)
      cy.visit(`${baseMFEURL}/learning/course/${courseId}/home`)

      // Verify that the course content is accessible
      cy.contains('Begin your course today').should('be.visible')
      cy.contains('This course is archived, which means you can review course content but it is no longer active.').should('be.visible')
      scheduleAndDetails.navigateToDatesTab()

      // Verify course start date
      scheduleAndDetails.verifyDateonDatesTab('Course starts', startDateTime)
      // Verify course end date
      scheduleAndDetails.verifyDateonDatesTab('Course ends', endDateTime)
    })
  })

  describe('[TC_AUTHOR_109] Set start time and end time', { tags: '@regression' }, function () {
    it('Set start date today with future time and verify that student cannot yet see courseware', function () {
      const todayDateTime = new Date()
      const hoursOffset = 2

      const futureHours = todayDateTime.getHours() + hoursOffset
      todayDateTime.setHours(futureHours)
      const futureStartTime = todayDateTime.toISOString()
      const endDateTime = scheduleAndDetails.getDateWithOffset(30)

      scheduleAndDetails.setStartDate(courseId, futureStartTime)
        .then(() => scheduleAndDetails.setEndDate(courseId, endDateTime))
        .then(() => {
          cy.visit(`${baseMFEURL}/learning/course/${courseId}/home`)

          // Verify the alert message on about page that course not yet started is displayed
          scheduleAndDetails.verifyAlertMessageContent(hoursOffset)
        })
    })

    it('Set start date today with past time and verify that student can see courseware', function () {
      const todayDateTime = new Date()
      const hoursOffset = -2

      const pastHours = todayDateTime.getHours() + hoursOffset
      todayDateTime.setHours(pastHours)
      const pastStartTime = todayDateTime.toISOString()
      const endDateTime = scheduleAndDetails.getDateWithOffset(30)

      scheduleAndDetails.setStartDate(courseId, pastStartTime)
        .then(() => scheduleAndDetails.setEndDate(courseId, endDateTime))
        .then(() => {
          cy.visit(`${baseMFEURL}/learning/course/${courseId}/home`)

          // Verify that the course content is accessible
          cy.contains('Begin your course today').should('be.visible')
        })
    })

    it('Set end date today with past time and verify the course is now archived', function () {
      const todayDateTime = new Date()
      const hoursOffset = -2

      const pastHours = todayDateTime.getHours() + hoursOffset
      todayDateTime.setHours(pastHours)
      const pastEndTime = todayDateTime.toISOString()
      const startDateTime = scheduleAndDetails.getDateWithOffset(-10)

      scheduleAndDetails.setStartDate(courseId, startDateTime)
        .then(() => scheduleAndDetails.setEndDate(courseId, pastEndTime))
        .then(() => {
          cy.visit(`${baseMFEURL}/learning/course/${courseId}/home`)

          // Verify that the course content is accessible
          cy.contains('Begin your course today').should('be.visible')
          cy.contains('This course is archived, which means you can review course content but it is no longer active.').should('be.visible')
        })
    })

    it('Verify course start date in Studio Course Outline', function () {
      const startDateTime = scheduleAndDetails.getDateWithOffset(0)
      const endDateTime = scheduleAndDetails.getDateWithOffset(30)

      scheduleAndDetails.setStartDate(courseId, startDateTime)
        .then(() => scheduleAndDetails.setEndDate(courseId, endDateTime))
        .then(() => {
          // Navigate to Course Outline page
          cy.visit(`${baseMFEURL}/authoring/course/${courseId}`)
          // Verify course start date in Studio Course Outline
          scheduleAndDetails.verifyStartDateInCourseOutline(startDateTime)
        })
    })
  })

  describe('[TC_AUTHOR_110] Set certificates available date', function () {
    it.skip('Set certificates available date', function () {
    })
  })

  describe('[TC_AUTHOR_111] Set enrollment start date and end date', function () {
    it.skip('Set enrollment start date and end date', function () {
    })
  })

  describe('[TC_AUTHOR_112] Set enrollment start time and end time', function () {
    it.skip('Set enrollment start time and end time', function () {
    })
  })

  describe('[TC_AUTHOR_113] Word cloud "word_cloud" in advanced settings', function () {
    it.skip('Word cloud "word_cloud" in advanced settings', function () {
    })
  })

  describe('[TC_AUTHOR_114] Create About page in html with instructor images', function () {
    it.skip('Create About page in html with instructor images', function () {
    })
  })

  describe('[TC_AUTHOR_115] Upload course card image', function () {
    it.skip('Upload course card image', function () {
    })
  })

  describe('[TC_AUTHOR_116] Insert YouTube URL for course intro video', function () {
    it.skip('Insert YouTube URL for course intro video', function () {
    })
  })

  describe('[TC_AUTHOR_117] Set hours of effort', function () {
    it.skip('Set hours of effort', function () {
    })
  })

  describe('[TC_AUTHOR_154] Prerequisite Course function working', function () {
    it.skip('Prerequisite Course function working', function () {
    })
  })
})
