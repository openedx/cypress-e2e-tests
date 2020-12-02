import HelperFunctions from '../helpers/helper_functions'
import LandingPage from '../pages/landing_page'

describe('landing page tests', function () {
  const landingPage = new LandingPage()

  beforeEach(function () {
    cy.login_using_api(Cypress.env('ADMIN_USER_EMAIL'), Cypress.env('ADMIN_USER_PASSWORD'))
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
  })

  it('checks user menu content and actions', function () {
    // Check user email in profile drop down
    landingPage.getUserEmail().should('eq', Cypress.env('ADMIN_USER_EMAIL'))
    // Logout the user from application
    // landingPage.logoutUser()
    // // Check that enterprise list container is not present
    // landingPage.enterpriseListContainer().should('not.exist')
  })

  it('checks logo information', function () {
    const edXlogoName = 'edX logo'
    // Check for log alt text and logo link in header
    landingPage.getLogoAltAttributes('header', 'alt').should('eq', edXlogoName)
    // Check for logo alt text and logo link in footer
    landingPage.getLogoAltAttributes('footer', 'alt').should('eq', edXlogoName)
  })

  it('checks nav links in footer', function () {
    const expectedFooterNavLinks = {
      'Terms of Service': 'https://www.edx.org/edx-terms-service',
      'Privacy Policy': 'https://www.edx.org/edx-privacy-policy',
      Support: '/public/support',
    }
    // Check for the presence of valid text and links in footer section
    landingPage.getFooterNavItems().then((elems) => {
      const actualFooterNavLinks = HelperFunctions.getLabelAndUrlsDict(elems)
      expect(actualFooterNavLinks).to.deep.equal(expectedFooterNavLinks)
    })
  })

  it('checks enterprise list', function () {
    cy.fixture('enterprise_list.json').as('enterpriseData')
    // Check the names and urls of enterprises
    landingPage.getEnterpriseList().then((elems) => {
      const actualEnterpriseList = HelperFunctions.getLabelAndUrlsDict(elems)
      expect(actualEnterpriseList).to.include(this.enterpriseData)
    })
  })

  it('checks the search functionality', function () {
    // It searches the enterprises using different search literals and verify the results
    cy.fixture('search_data').then((searchItems) => {
      searchItems.forEach((searchItem) => {
        landingPage.searchEnterprise(searchItem.search_literal)
        landingPage.getEnterpriseList().then((elems) => {
          const actualSearchedEnterpriseList = HelperFunctions.getLabelAndUrlsDict(elems)
          expect(actualSearchedEnterpriseList).to.include(searchItem.expected_search_results)
        })
      })
    })
  })
})
