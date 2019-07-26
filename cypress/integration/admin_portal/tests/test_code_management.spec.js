import LandingPage from '../pages/landing_page'
import CodeManagementPage from '../pages/enterprise_code_management'

describe('landing page tests', function () {
  const landingPage = new LandingPage()
  const codeManagementDashboard = new CodeManagementPage()

  before(function(){
    cy.login_using_api(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
    landingPage.goToEnterprise('SuccessFactors')
    landingPage.openCodeManagement()
  })

  it('Verifies the validation checks on REQUEST MORE CODES form', function () {
   codeManagementDashboard.requestMoreCodes()
   codeManagementDashboard.getFormField('emailAddress').should('have.attr', 'value', 'zrana@edx.org')
   codeManagementDashboard.getFormField('enterpriseName').should('have.attr', 'value', 'SuccessFactors')
   codeManagementDashboard.getLabels('Company').should('have.text', 'Company*').children().should('have.class', 'required')
   codeManagementDashboard.getLabels('Email').should('have.text', 'Email Address*').children().should('have.class', 'required')
   codeManagementDashboard.getLabels('Codes').should('have.text', 'Number of Codes')
   codeManagementDashboard.getRequestCodesButton().should('have.attr', 'type', 'submit').and('have.text', 'Request Codes')
   codeManagementDashboard.getCancelButton().should('have.attr', 'href', '/successfactors/admin/coupons').and('have.text', 'Cancel')
   codeManagementDashboard.getFormField('emailAddress').clear().prev().click()
   codeManagementDashboard.getInvalidFeedback().should('have.text', 'This field is required.')
   codeManagementDashboard.getFormField('emailAddress').type('zrana@')
   codeManagementDashboard.getInvalidFeedback().should('have.text', 'Must be a valid email address.')
   codeManagementDashboard.getRequestCodesButton().should('have.attr', 'disabled')
  })

  it('Verifies the correct functioning of REQUEST CODES form', function () {
   const request_codes_url = 'https://portal.stage.edx.org/successfactors/admin/coupons/request'
   const code_management_main = 'https://portal.stage.edx.org/successfactors/admin/coupons'
   codeManagementDashboard.requestMoreCodes()
   cy.url().should('eq', request_codes_url)
   codeManagementDashboard.getCancelButton().click()
   cy.url().should('eq', code_management_main)
   codeManagementDashboard.requestMoreCodes()
   cy.url().should('eq', request_codes_url)
  //  Request for more codes
   codeManagementDashboard.getFormField('numberOfCodes').type('5')
   codeManagementDashboard.getRequestCodesButton().click()
   cy.url().should('eq', code_management_main)
  //  Cypress returns by concatenating both the strings, so we are asserting both success messages as substrings
   codeManagementDashboard.getSuccessMessage().should(($dialogue_message)=>{
     const text = $dialogue_message.text()
     expect(text).includes('Request for more codes received')
     expect(text).includes('The edX Customer Success team will contact you soon.')
    })
  })
})