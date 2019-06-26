import HelperFunctions from '../helpers/helper_functions'
import LandingPage from '../pages/landing_page'
import EnterpriseDashboard from '../pages/enterprise_dashboard'

describe('Enterprise Logos and nav links verification', function() {
  const helpers = new HelperFunctions()
  const landingPage = new LandingPage()
  const dashboard = new EnterpriseDashboard()
  const trimmedEnterpriseName = Cypress.env('enterprise_name').toLowerCase().replace(/ /g, '')

  beforeEach(function () {
    cy.login_using_api(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
  })

  it('checks logo information', function() {
    const edxLogoName = 'edX logo'
    const enterpriseLogoName = `${Cypress.env('enterprise_name')} logo`
    const edxLogoLink = new RegExp('/ef7b61e5efb512ea4472f1c32fa17907.png')
    const enterpriseLogoLink = new RegExp('/enterprise/branding/5/5_logo.png')
    // Open the target enterprise dashboard
    landingPage.goToEnterprise(Cypress.env('enterprise_name'))
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

  it('checks nav links in footer', function() {
    const footerNavLinks = {
      'Terms of Service': 'https://www.edx.org/edx-terms-service',
      'Privacy Policy': 'https://www.edx.org/edx-privacy-policy',
      Support: `/${trimmedEnterpriseName}/support`,
    }
    // Open the target enterprise dashboard
    landingPage.goToEnterprise(Cypress.env('enterprise_name'))
    // Check for the presence of valid text and links in footer section
    dashboard.getFooterNavItems().then((elems) => {
      helpers.verifyLinksAndText(elems, footerNavLinks)
    })
  })
})

describe('Enterprise cards and table verification', function() {
  const landingPage = new LandingPage()
  const dashboard = new EnterpriseDashboard()
  const fullTableTitle = 'Full Report'

  beforeEach(function() {
    cy.login_using_api(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
  })

  it('checks cards details', function() {
    // Open the target enterprise dashboard
    landingPage.goToEnterprise(Cypress.env('enterprise_name'))
    // Go through cards and verify card main text and value against the text
    cy.fixture('card_info').then((cards) => {
      cards.forEach((card) => {
        // Go through cards and verify card text
        dashboard.getCardText(card.number).should('have.text', card.text)
        // Go through cards and verify detailed breakdown questions in card footers
        dashboard.getCardQuestions(card.number).then((cardQuestions) => {
          expect([...cardQuestions].map(el => el.textContent.trim())).to.deep.equal(card.questions)
        })
      })
    })
  })

  it('checks default table headers', function() {
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
    landingPage.goToEnterprise(Cypress.env('enterprise_name'))
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

  it('checks filtered tables details', function() {
    cy.server()
    // Open the target enterprise dashboard
    landingPage.goToEnterprise(Cypress.env('enterprise_name'))
    // Select the target table by opening the card detail view and clicking the target question
    cy.fixture('tables_info').then((tables) => {
      tables.forEach((table) => {
        // Define a route for all tables XHR requests
        cy.route({
          method: 'GET',
          url: `**/enterprise/api/v0/enterprise/*/${table.request_url_part}**`,
        }).as('tableData')
        // Expand card footer and click on question
        dashboard.openCardDetailedBreakdownArea(table.card_number)
        dashboard.clickCardDetailedBreakdownQuestion(table.card_number, table.question_text)
        // Get and verify Table Title
        dashboard.getTableTitle().should('have.text', table.table_title)
        // Wait for Tables XHR requests
        cy.wait('@tableData').then((xhr) => {
          // If table data exists verify table headers
          if (xhr.responseBody.count > 0) {
            dashboard.getTableHeaders(table.table_name).then((elems) => {
              const ActualTableHeaders = [...elems].map(el => el.textContent.trim())
              expect(ActualTableHeaders).to.deep.equal(table.table_headers)
            })
          // Else check the proper message for no results
          } else {
            dashboard.getEmptyTableWarning().should('have.text', 'There are no results.')
          }
        })
        // Reset to default table
        dashboard.resetTable()
        dashboard.getTableTitle().should('have.text', fullTableTitle)
      })
    })
  })
})
