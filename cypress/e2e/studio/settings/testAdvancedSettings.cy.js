import AdvancedSettings from '../../../pages/studio/settings/advancedSettings'
import { NEW_COURSE_DATA } from '../../../support/constants'// '../../../../../support/constants'

describe('[TC_AUTHOR_131] Course display name', function () {
  it.skip('Course display name (remember to reindex course in /courses page)', () => {
  })
})

describe('[TC_AUTHOR_132] Course maximum student enrollment', function () {
  it.skip('Course maximum student enrollment', () => {
  })
})

describe('[TC_AUTHOR_133] Test course visibility in catalog', function () {
  const baseMFEURL = Cypress.env('BASE_MFE_URL')
  before(function () {
    cy.clearCookies()
  })

  beforeEach(function () {
    cy.loginAdminLmsCms()
    cy.visit(`${baseMFEURL}/authoring/course/${NEW_COURSE_DATA.courseId}`)
  })

  it.skip('Test course visibility = `none` behavior', function () {
  })

  it.skip('Test course visibility = `about` behavior', function () {
  })

  it.skip('Test course visibility = `both` behavior', function () {
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
