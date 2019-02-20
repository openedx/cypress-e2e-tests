import HelperFunctions from '../helpers/helper_functions'
import LandingPage from '../pages/landing_page'
import EnterpriseDashboard from '../pages/enterprise_dashboard'

describe('Login and Dashoboard tests', () => {
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
    const expectedFooterNavLinks = {
      'Terms of Service': 'https://www.edx.org/edx-terms-service',
      'Privacy Policy': 'https://www.edx.org/edx-privacy-policy',
      Support: `/${trimmedEnterpriseName}/support`,
    }
    // Open the target enterprise dashboard
    landingPage.goToEnterprise(enterpriseName)
    // Check for the presence of valid text and links in footer section
    dashboard.getFooterNavItems().then((elems) => {
      helpers.verifyLinksAndText(elems, expectedFooterNavLinks)
    })
  })

  it('checks cards details', () => {
    const expectedCardInfo = {
      1: { 'total number of learners registered': '88' },
      2: { 'learners enrolled in at least one course': '23' },
      3: { 'active learners in the past week': '0' },
      4: { 'course completions': '1' },
    }
    const expectedCardDetailedBreakdown = {
      1: ['Which learners are registered but not yet enrolled in any courses?'],
      2: ['How many courses are learners enrolled in?', 'Who is no longer enrolled in a current course?'],
      3: ['Who are my top active learners?', 'Who has not been active for over a week?', 'Who has not been active for over a month?'],
      4: ['How many courses have been completed by learners?', 'Who completed a course in the past week?'],
    }
    // Open the target enterprise dashboard
    landingPage.goToEnterprise(enterpriseName)
    // Go through cards and verify card main text and value against the text
    Object.keys(expectedCardInfo).forEach((key) => {
      dashboard.cardText(key).should('have.text', Object.keys(expectedCardInfo[key])[0])
      dashboard.cardTitle(key).should('have.text', Object.values(expectedCardInfo[key])[0])
    })
    // Go through cards and verify detailed breakdown questions in card footers
    Object.keys(expectedCardDetailedBreakdown).forEach((key) => {
      dashboard.cardDetailedBreakdown(key).then((elems) => {
        const actualCardDetailedBreajdown = [...elems].map(el => el.textContent.trim())
        expect(actualCardDetailedBreajdown).to.deep.equal(expectedCardDetailedBreakdown[key])
      })
    })
  })

  it('checks table headers', () => {
    const expectedTableHeaders = [
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
    // Get and verify table headers
    dashboard.tableHeaders().then((elems) => {
      const ActualTableHeaders = [...elems].map(el => el.textContent.trim())
      expect(ActualTableHeaders).to.deep.equal(expectedTableHeaders)
    })
    // check the default sorting text of a column
    // Click on it to sort in descending order
    // Click again to sort in ascending ordewr
    dashboard.specificTableHeader(3)
      .should('have.text', 'Course Price click to sort ')
      .click()
      .should('have.text', 'Course Price sort descending ')
      .click()
      .should('have.text', 'Course Price sort ascending ')
  })
})
