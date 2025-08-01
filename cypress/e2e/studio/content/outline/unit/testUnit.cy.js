import UnitPage from '../../../../../pages/studio/content/outline/unit/unitPage'
import randomString from '../../../../../support/utils'
import { NEW_COURSE_DATA } from '../../../../../support/constants'

describe('Unit Page Tests', function () {
  const unitPage = new UnitPage()
  const baseMFEURL = Cypress.env('BASE_MFE_URL')

  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.loginAdminLmsCms()
    // Need to get empty course for unit tests
    cy.visit(`${baseMFEURL}/authoring/course/${NEW_COURSE_DATA.courseId}`)
  })

  describe('[TC_AUTHOR_40] View live button', { tags: '@smoke' }, function () {
    it('should add section, subsection and unit', function () {
      const courseData = {}
      courseData.textForUnit = `Random text for unit ${randomString(10)}`
      
      unitPage.addSection()
        .then(() => cy.get('@sectionLocator'))
        .then((sectionLocator) => {
          courseData.sectionLocator = sectionLocator
          return unitPage.addSubsection()
        })
        .then(() => cy.get('@subsectionLocator'))
        .then((subsectionLocator) => {
          courseData.subsectionLocator = subsectionLocator
          return unitPage.addUnit()
        })
        .then(() => cy.get('@unitLocator'))
        .then((unitLocator) => {
          courseData.unitLocator = unitLocator
          cy.writeFile('cypress/fixtures/new_course_data.json', courseData)
        }).then(() => {
          unitPage.addTextBlock(courseData.textForUnit)
        })
    })

    it('View live button working for not published course', function () {
      unitPage.openUnit(NEW_COURSE_DATA.courseId)
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen')
      })
      unitPage.getViewLiveButton().should('be.visible').click()
      cy.fixture('new_course_data').then((data) => {
        cy.get('@windowOpen').should(
          'be.calledWithMatch',
          `/courses/${NEW_COURSE_DATA.courseId}/jump_to/${data.unitLocator}`
        )
        cy.visit(`${Cypress.env('BASE_MFE_URL')}/learning/course/${NEW_COURSE_DATA.courseId}/${data.subsectionLocator}`)
        cy.contains('There is no content here.').should('be.visible')
      })
    })

    it('View live button working for published course', function () {
      unitPage.publishSection().then(() => {

        unitPage.openUnit(NEW_COURSE_DATA.courseId)
        cy.window().then((win) => {
          cy.stub(win, 'open').as('windowOpen')
        })
        unitPage.getViewLiveButton().should('be.visible').click()
        cy.fixture('new_course_data').then((data) => {
          cy.get('@windowOpen').should(
            'be.calledWithMatch',
            `/courses/${NEW_COURSE_DATA.courseId}/jump_to/${data.unitLocator}`
          )
          cy.visit(`${Cypress.env('BASE_MFE_URL')}/learning/course/${NEW_COURSE_DATA.courseId}/${data.subsectionLocator}`)
          unitPage.checkIframeContent(data.textForUnit)
        })
      })
    })
  })

  describe('[TC_AUTHOR_51] Preview button', { tags: '@smoke' }, function () {
    it('Preview button working', function () {
      unitPage.openUnit(NEW_COURSE_DATA.courseId)
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen')
      })
      unitPage.getPreviewButton().should('be.visible').click()
      cy.fixture('new_course_data').then((data) => {
        cy.get('@windowOpen').should(
          'be.calledWithMatch',
          `/courses/${NEW_COURSE_DATA.courseId}/jump_to/${data.unitLocator}`
        )
        cy.visit(`${Cypress.env('BASE_MFE_URL')}/learning/course/${NEW_COURSE_DATA.courseId}/${data.subsectionLocator}`)
        unitPage.checkIframeContent(data.textForUnit)
      })
    })
  })

  describe('[TC_AUTHOR_42] Add new unit button', { tags: '@smoke' }, function () {
    it('Add new unit button working', function () {
      //unitPage.expandSubection()
      unitPage.addUnit()
        .then(() => cy.get('@unitLocator'))
        .then((unitLocator) => {
          cy.url().should('include', unitLocator)
        })
        .then(() => {
          unitPage.checkEmptyUnitBlock()
          cy.visit(`${baseMFEURL}/authoring/course/${NEW_COURSE_DATA.courseId}`)
          unitPage.expandSubection()
          unitPage.deleteUnit()
        })
    })
  })

  describe('[TC_AUTHOR_43] Hide from learners checkbox', { tags: '@smoke' }, function () {
    it('Hide from learners checkbox working', function () {
      unitPage.expandSubection()
      unitPage.hideFromLearners()
      unitPage.checkHideBadge()
    })
  })

  describe('[TC_AUTHOR_44] Publish button', { tags: '@smoke' }, function () {
    it('Publish button working', function () {
      unitPage.publishSection().then(() => {
        unitPage.openUnit(NEW_COURSE_DATA.courseId)
        cy.window().then((win) => {
          cy.stub(win, 'open').as('windowOpen')
        })
        unitPage.getViewLiveButton().should('be.visible').click()
        cy.fixture('new_course_data').then((data) => {
          cy.get('@windowOpen').should(
            'be.calledWithMatch',
            `/courses/${NEW_COURSE_DATA.courseId}/jump_to/${data.unitLocator}`
          )
          cy.visit(`${Cypress.env('BASE_MFE_URL')}/learning/course/${NEW_COURSE_DATA.courseId}/${data.subsectionLocator}`)
          unitPage.checkIframeContent(data.textForUnit)
        })
      })
    })

    // need to change using API request
    it('Delete section after all unit tests', { tags: '@smoke' }, function () {
      unitPage.deleteSection()
    })
  })
})

describe('[TC_AUTHOR_46] Previous and next buttons', function () {
  it.skip('Previous and next buttons working', function () {
  })
})

describe('[TC_AUTHOR_151] Python graders', function () {
  it.skip('Python graders. Problem that requires python code as an answer is successfully graded', function () {
  })
})

describe('[TC_AUTHOR_REDWOOD_43] Copy and Paste Units', function () {
  it.skip('Copy and Paste Units from the Unit Page', function () {
  })
})

describe('[TC_AUTHOR_57] Basic forum v2 component creating testing', function () {
  it.skip('Basic forum component creating testing', function () {
  })
})
