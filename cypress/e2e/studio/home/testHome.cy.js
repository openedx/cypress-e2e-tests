import HomePage from '../../../pages/studio/home/homePage'
import randomString from '../../../support/utils'
import { NEW_COURSE_DATA } from '../../../support/constants'

describe('[TC_AUTHOR_1A] User is able to create a new course with a new organization', { tags: '@smoke' }, function () {
  const homePage = new HomePage()
  const baseMFEURL = Cypress.env('BASE_MFE_URL')

  const newCourseInfo = {
    courseName: `New Course ${randomString(7)}`,
    courseOrg: `Org_${randomString(7)}`,
    courseNumber: randomString(7),
    courseRun: `${new Date().getFullYear()}_T1`,
  }

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.loginAdminLmsCms()
    cy.visit(`${baseMFEURL}/authoring/home`)
  })

  it('should display the Studio Home page', function () {
    homePage.getPageTitle().should('contain', 'Studio home')
  })

  it('should display the Create Course button', function () {
    homePage.getNewCourseButton().should('be.visible')
  })

  it('User is able to create a new course with a new organization', function () {
    if (!Cypress.env('ENABLE_CREATE_NEW_COURSE')) {
      this.skip()
    }
    homePage.createNewCourse(
      newCourseInfo.courseName,
      newCourseInfo.courseOrg,
      newCourseInfo.courseNumber,
      newCourseInfo.courseRun,
    )
  })

  it('Create new course for unit tests', function () {
    if (!Cypress.env('ENABLE_CREATE_NEW_COURSE_FOR_UNIT_TESTS')) {
      this.skip()
    }
    homePage.createNewCourse(
      NEW_COURSE_DATA.courseName,
      NEW_COURSE_DATA.courseOrg,
      NEW_COURSE_DATA.courseCode,
      NEW_COURSE_DATA.courseRun,
    )
  })
})

describe('[TC_AUTHOR_1B] Scenario: User is able to create a new course with an existing organization', function () {
  it.skip('Scenario: User is able to create a new course with an existing organization', function () {
  })
})

describe('[TC_AUTHOR_2] Create new library', function () {
  it.skip('Create new library', function () {
  })
})

describe('[TC_AUTHOR_3] Re-run course button', function () {
  it.skip('Re-run course button', function () {
  })
})

describe('[TC_AUTHOR_4] View live button', function () {
  it.skip('View live button', function () {
  })
})

describe('[TC_AUTHOR_5] Archived courses listed', function () {
  it.skip('Archived courses listed', function () {
  })
})

describe('[TC_AUTHOR_6] Your-platform-name', function () {
  it.skip('Your-platform-name is configured', function () {
  })
})

describe('[TC_AUTHOR_7] Help buttons link to correct external pages', function () {
  it.skip('Help buttons link to correct external pages', function () {
  })
})

describe('[TC_AUTHOR_REDWOOD_69] Searching for courses by free-text search', function () {
  it.skip('Searching for courses by free-text search', function () {
  })
})

describe('[TC_AUTHOR_REDWOOD_70] Using filters independently of keyword searches', function () {
  it.skip('Using filters independently of keyword searches', function () {
  })
})

describe('[TC_AUTHOR_REDWOOD_71] Using the 3-dot menu on course cards', function () {
  it.skip('Using the 3-dot menu on course cards', function () {
  })
})

describe('[TC_AUTHOR_146] Admin/regular user behaviour', function () {
  it.skip('As a regular user', function () {
  })

  it.skip('As an admin user', function () {
  })
})
