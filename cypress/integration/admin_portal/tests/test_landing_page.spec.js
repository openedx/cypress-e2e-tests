import HelperFunctions from '../helpers/helper_functions'
import LandingPage from '../pages/landing_page'

describe('landing page tests', () => {
  const helpers = new HelperFunctions()
  const landingPage = new LandingPage()

  beforeEach(() => {
    cy.login_using_api(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
  })

  it('checks logo information', () => {
    const edXlogoName = 'edX logo'
    const edXlogoLink = new RegExp('/ef7b61e5efb512ea4472f1c32fa17907.png')
    // Check for log alt text and logo link in header
    landingPage.getLogoAltAttributes('header', 'alt').should('eq', edXlogoName)
    landingPage.getLogoAltAttributes('header', 'src').should('match', edXlogoLink)
    // Check for logo alt text and logo link in footer
    landingPage.getLogoAltAttributes('footer', 'alt').should('eq', edXlogoName)
    landingPage.getLogoAltAttributes('footer', 'src').should('match', edXlogoLink)
  })

  it('checks nav links in footer', () => {
    const expectedFooterNavLinks = {
      'Terms of Service': 'https://www.edx.org/edx-terms-service',
      'Privacy Policy': 'https://www.edx.org/edx-privacy-policy',
      Support: '/public/support',
    }
    // Check for the presence of valid text and links in footer section
    landingPage.getFooterNavItems().then((elems) => {
      helpers.verifyLinksAndText(elems, expectedFooterNavLinks)
    })
  })

  it('checks enterprise list', () => {
    const ExpectedEnterprises = {
      ArbiSoft: '/arbisoft/admin/learners',
      'Bessie Test Inc': '/bessie-test-inc/admin/learners',
      Boeing: '/boeing/admin/learners',
      'Degreed Company': '/degreed-company/admin/learners',
      'Demo 1': '/demo-1/admin/learners',
      'Success Factors': '/successfactors/admin/learners',
      'MA Corp': '/macorp/admin/learners',
      MattWLTest: '/mattwltest/admin/learners',
      Microsoft: '/microsoft/admin/learners',
      'OpenCraft Australia': '/opencraft-australia/admin/learners',
      'Owl Enterprise': '/owl-enterprise/admin/learners',
      'Pied Piper': '/pied-piper/admin/learners',
      'QA Company': '/successfactors-qa-company/admin/learners',
      'Test Ent': '/test-ent/admin/learners',
      'Test New Enterprise': '/test-new-enterprise/admin/learners',
      TestDemoEnterpriseTest: '/testdemoenterprisetest/admin/learners',
      'Vandelay Industries (Direct Integration Test Company)': '/vandelay-industries-direct-int/admin/learners',
      'WhirlPool (edx)': '/whirlpooledx/admin/learners',
      Whirlpool: '/whirlpool/admin/learners',
      'test gdpr enterprise customer': '/test-gdpr-enterprise-customer/admin/learners',
    }
    // Check the names and urls of enterprises
    landingPage.getEnterpriseList().then((elems) => {
      helpers.verifyLinksAndText(elems, ExpectedEnterprises)
    })
  })

  it('checks the search functionality', () => {
    // It searches the enterprises using different search literals and verify the results
    cy.fixture('search_data').then((searchItems) => {
      searchItems.forEach((searchItem) => {
        landingPage.searchEnterprise(searchItem.search_literal)
        landingPage.getEnterpriseList().then((elems) => {
          helpers.verifyLinksAndText(elems, searchItem.expected_search_results)
        })
      })
    })
  })
})
