import HelperFunctions from '../helpers/helper_functions'
import LandingPage from '../pages/landing_page'
import EnterpriseDashboard from '../pages/enterprise_dashboard'

describe('Login and Dashoboard tests', () => {
  const helpers = new HelperFunctions()
  const landingPage = new LandingPage()
  const dashboard = new EnterpriseDashboard()
  const enterriseName = 'Microsoft'

  beforeEach(() => {
    cy.login_using_api(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
  })

  it('checks logo information', () => {
    const edxLogoName = 'edX logo'
    const enterpriseLogoName = 'Microsoft logo'
    const edxLogoLink = new RegExp('/ef7b61e5efb512ea4472f1c32fa17907.png')
    const enterpriseLogoLink = new RegExp('/enterprise/branding/7/7_logo.png')
    // Open target enterprise page
    landingPage.goToEnterprise(enterriseName)
    // Check for logo alt text and logo link in header
    dashboard.getLogoAltAttributes('header', 'alt').should('eq', enterpriseLogoName)
    dashboard.getLogoAltAttributes('header', 'src').should('match', enterpriseLogoLink)
    // Check for edX logo alt text and logo link in footer
    dashboard.getLogoAltAttributes('footer', 'alt').should('eq', edxLogoName)
    dashboard.getLogoAltAttributes('footer', 'src').should('match', edxLogoLink)
    // Check for enterprise logo alt text and logo link in footer
    dashboard.getLogoAltAttributes('footer', 'alt', '/microsoft').should('eq', enterpriseLogoName)
    dashboard.getLogoAltAttributes('footer', 'src', '/microsoft').should('match', enterpriseLogoLink)
  })

  it('checks nav links in footer', () => {
    const expectedFooterNavLinks = {
      'Terms of Service': 'https://www.edx.org/edx-terms-service',
      'Privacy Policy': 'https://www.edx.org/edx-privacy-policy',
      Support: '/microsoft/support',
    }
    landingPage.goToEnterprise(enterriseName)
    // Check for the presence of valid text and links in footer section
    dashboard.getFooterNavItems().then((elems) => {
      helpers.verifyLinksAndText(elems, expectedFooterNavLinks)
    })
  })

  it('checks cards details', () => {
    const expectedCardInfo = {
      1: { 'total number of learners registered': '4' },
      2: { 'learners enrolled in at least one course': '0' },
      3: { 'active learners in the past week': '0' },
      4: { 'course completions': '0' },
    }
    const expectedCardDetailedBreakdown = {
      1: ['Which learners are registered but not yet enrolled in any courses?'],
      2: ['How many courses are learners enrolled in?', 'Who is no longer enrolled in a current course?'],
      3: ['Who are my top active learners?', 'Who has not been active for over a week?', 'Who has not been active for over a month?'],
      4: ['How many courses have been completed by learners?', 'Who completed a course in the past week?'],
    }

    landingPage.goToEnterprise(enterriseName)
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
})
