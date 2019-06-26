import HelperFunctions from '../helpers/helper_functions'
import LandingPage from '../pages/landing_page'

describe('landing page tests', function() {
  const helpers = new HelperFunctions()
  const landingPage = new LandingPage()

  beforeEach(function() {
    cy.login_using_api(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
  })

  it('checks user menu content and actions', function() {
    // Check user email in profile drop down
    landingPage.getUserEmail().should('eq', Cypress.env('ADMIN_PORTAL_USER_EMAIL'))
    // Logout the user from application
    // landingPage.logoutUser()
    // // Check that enterprise list container is not present
    // landingPage.enterpriseListContainer().should('not.exist')
  })

  it('checks logo information', function() {
    const edXlogoName = 'edX logo'
    const edXlogoLink = new RegExp('/ef7b61e5efb512ea4472f1c32fa17907.png')
    // Check for log alt text and logo link in header
    landingPage.getLogoAltAttributes('header', 'alt').should('eq', edXlogoName)
    landingPage.getLogoAltAttributes('header', 'src').should('match', edXlogoLink)
    // Check for logo alt text and logo link in footer
    landingPage.getLogoAltAttributes('footer', 'alt').should('eq', edXlogoName)
    landingPage.getLogoAltAttributes('footer', 'src').should('match', edXlogoLink)
  })

  it('checks nav links in footer', function() {
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

  it('checks enterprise list', function(){
    cy.fixture('enterprise_list.json').as('enterpriseData')
    // Check the names and urls of enterprises
    landingPage.getEnterpriseList().then((elems) => {
      helpers.verifyLinksAndText(elems, this.enterpriseData)
    })
  })

  it('checks the search functionality', function() {
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
