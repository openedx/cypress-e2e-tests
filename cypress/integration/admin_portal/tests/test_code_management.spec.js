import HelperFunctions from '../helpers/helper_functions'
import LandingPage from '../pages/landing_page'
import CodeManagementPage from '../pages/enterprise_code_management'

describe('landing page tests', function () {
  const helpers = new HelperFunctions()
  const landingPage = new LandingPage()
  const codeManagementDashboard = new CodeManagementPage()

  beforeEach(function () {
    cy.login_using_api(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
  })

  it('checks the request codes form contents', function () {
   var request_codes_url = 'https://portal.stage.edx.org/successfactors/admin/coupons/request'
   landingPage.goToEnterprise('SuccessFactors')
   landingPage.openCodeManagement()
   cy.get('.enterprise-app #sidebar').invoke('attr', 'aria-expanded', 'false')

   landingPage.requestMoreCodes()
   cy.assert_current_url(request_codes_url)
   landingPage.getFormField('emailAddress').should('have.attr', 'value', 'zrana@edx.org')
   landingPage.getFormField('enterpriseName').should('have.attr', 'value', 'SuccessFactors')
   landingPage.getLabels('Company').should('have.text', 'Company*').children().should('have.class', 'required')
   landingPage.getLabels('Email').should('have.text', 'Email Address*').children().should('have.class', 'required')
   landingPage.getLabels('Number of Codes').should('have.text', 'Number of Codes')
   landingPage.getRequestCodesButton().should('have.attr', 'type', 'submit').should('have.text', 'Request Codes')
   landingPage.getCancelButton().should('have.attr', 'href', '/successfactors/admin/coupons').should('have.text', 'Cancel')
   landingPage.getFormField('emailAddress').clear().prev().click()
   landingPage.getInvalidFeedback().should('have.text', 'This field is required.')
   landingPage.getFormField('emailAddress').type('zrana@')
   landingPage.getInvalidFeedback().should('have.text', 'Must be a valid email address.')
   landingPage.getRequestCodesButton().should('have.attr', 'disabled')
   landingPage.getCancelButton().click()
   cy.assert_current_url('https://portal.stage.edx.org/successfactors/admin/coupons')
   landingPage.requestMoreCodes()
   cy.assert_current_url(request_codes_url)
   landingPage.getFormField('numberOfCodes').type('5')
   landingPage.getRequestCodesButton().click()
   cy.assert_current_url('https://portal.stage.edx.org/successfactors/admin/coupons')
   cy.get('.alert-dialog .message .title').should('have.text', 'Request for more codes received').next().should('have.text', 'The edX Customer Success team will contact you soon.')
  })
})