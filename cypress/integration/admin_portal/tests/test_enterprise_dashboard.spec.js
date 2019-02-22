import HelperFunctions from '../helpers/helper_functions'
import LandingPage from '../pages/landing_page'
import EnterpriseDashboard from '../pages/enterprise_dashboard'

describe('Enterprise Logos and nav links verification', () => {
  const helpers = new HelperFunctions()
  const landingPage = new LandingPage()
  const dashboard = new EnterpriseDashboard()
  const enterpriseName = 'Success Factors'
  const trimmedEnterpriseName = enterpriseName.toLowerCase().replace(/ /g, '')

  beforeEach(() => {
    cy.login_using_api(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
  })

  it('checks logo information', () => {
    const edxLogoName = 'edX logo'
    const enterpriseLogoName = `${enterpriseName} logo`
    const edxLogoLink = new RegExp('/ef7b61e5efb512ea4472f1c32fa17907.png')
    const enterpriseLogoLink = new RegExp('/enterprise/branding/5/5_logo.png')
    // Open the target enterprise dashboard
    landingPage.goToEnterprise(enterpriseName)
    // Check for logo alt text and logo link in header
    dashboard.getLogoAltAttributes('header', 'alt').should('eq', enterpriseLogoName)
    dashboard.getLogoAltAttributes('header', 'src').should('match', enterpriseLogoLink)
    // Check for edX logo alt text and logo link in footer
    dashboard.getLogoAltAttributes('footer', 'alt').should('eq', edxLogoName)
    dashboard.getLogoAltAttributes('footer', 'src').should('match', edxLogoLink)
    // Check for enterprise logo alt text and logo link in footer
    dashboard.getLogoAltAttributes('footer', 'alt', `/${trimmedEnterpriseName}`).should('eq', enterpriseLogoName)
    dashboard.getLogoAltAttributes('footer', 'src', `/${trimmedEnterpriseName}`).should('match', enterpriseLogoLink)
  })

  it('checks nav links in footer', () => {
    const footerNavLinks = {
      'Terms of Service': 'https://www.edx.org/edx-terms-service',
      'Privacy Policy': 'https://www.edx.org/edx-privacy-policy',
      Support: `/${trimmedEnterpriseName}/support`,
    }
    // Open the target enterprise dashboard
    landingPage.goToEnterprise(enterpriseName)
    // Check for the presence of valid text and links in footer section
    dashboard.getFooterNavItems().then((elems) => {
      helpers.verifyLinksAndText(elems, footerNavLinks)
    })
  })
})

describe('Enterprise cards and table verification', () => {
  const landingPage = new LandingPage()
  const dashboard = new EnterpriseDashboard()
  const enterpriseName = 'Success Factors'
  const cardInfo = {
    1: { 'total number of learners registered': '88' },
    2: { 'learners enrolled in at least one course': '23' },
    3: { 'active learners in the past week': '0' },
    4: { 'course completions': '1' },
  }
  const cardDetailedBreakdown = {
    1: ['Which learners are registered but not yet enrolled in any courses?'],
    2: ['How many courses are learners enrolled in?', 'Who is no longer enrolled in a current course?'],
    3: ['Who are my top active learners?', 'Who has not been active for over a week?', 'Who has not been active for over a month?'],
    4: ['How many courses have been completed by learners?', 'Who completed a course in the past week?'],
  }
  const fullTableTitle = 'Full Report'

  beforeEach(() => {
    cy.login_using_api(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
  })


  it('checks cards details', () => {
    // Open the target enterprise dashboard
    landingPage.goToEnterprise(enterpriseName)
    // Go through cards and verify card main text and value against the text
    Object.keys(cardInfo).forEach((key) => {
      dashboard.getCardText(key).should('have.text', Object.keys(cardInfo[key])[0])
      dashboard.getCardTitle(key).should('have.text', Object.values(cardInfo[key])[0])
    })
    // Go through cards and verify detailed breakdown questions in card footers
    Object.keys(cardDetailedBreakdown).forEach((key) => {
      dashboard.getCardDetailedBreakdown(key).then((elems) => {
        const actualCardDetailedBreajdown = [...elems].map(el => el.textContent.trim())
        expect(actualCardDetailedBreajdown).to.deep.equal(cardDetailedBreakdown[key])
      })
    })
  })

  it('checks default table headers', () => {
    const fullTableHeaders = [
      'Email sort ascending',
      'Course Title click to sort',
      'Course Price click to sort',
      'Start Date click to sort',
      'End Date click to sort',
      'Passed Date click to sort',
      'Current Grade click to sort',
      'Last Activity Date click to sort',
    ]
    // Open the target enterprise dashboard
    landingPage.goToEnterprise(enterpriseName)
    // Get and verify Table Title
    dashboard.getTableTitle().should('have.text', fullTableTitle)
    // Get and verify table headers
    dashboard.getTableHeaders('enrollments').then((elems) => {
      const ActualTableHeaders = [...elems].map(el => el.textContent.trim())
      expect(ActualTableHeaders).to.deep.equal(fullTableHeaders)
    })
    // check the default sorting text of a column
    // Click on it to sort in descending order
    // Click again to sort in ascending ordewr
    dashboard.getSpecificTableHeader('enrollments', 3)
      .should('have.text', 'Course Price click to sort ')
      .click()
      .should('have.text', 'Course Price sort descending ')
      .click()
      .should('have.text', 'Course Price sort ascending ')
  })

  it('checks registered unenrolled learners table headers', () => {
    const tableTitle = 'Registered Learners Not Yet Enrolled in a Course'
    const tableHeaders = [
      'Email sort ascending',
      'Account Created click to sort',
    ]
    // Open the target enterprise dashboard
    landingPage.goToEnterprise(enterpriseName)
    // Select the target table by opening the card detail view and clicking the target question
    dashboard.openCardDetailedBreakdownArea(1)
    dashboard.clickCardDetailedBreakdownQuestion(1, cardDetailedBreakdown[1][0])
    // Get and verify Table Title
    dashboard.getTableTitle().should('have.text', tableTitle)
    // Get and verify table headers
    dashboard.getTableHeaders('registered-unenrolled-learners').then((elems) => {
      const ActualTableHeaders = [...elems].map(el => el.textContent.trim())
      expect(ActualTableHeaders).to.deep.equal(tableHeaders)
    })
    // Reset to default table
    dashboard.resetTable()
    dashboard.getTableTitle().should('have.text', fullTableTitle)
  })
})
