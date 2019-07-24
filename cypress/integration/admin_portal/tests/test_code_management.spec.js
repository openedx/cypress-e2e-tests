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

  // it('checks the request codes form contents', function () {
  //   var request_codes_url = 'https://portal.stage.edx.org/successfactors/admin/coupons/request'
  //   landingPage.goToEnterprise('SuccessFactors')
  //   landingPage.openCodeManagement()
  //   cy.get('.enterprise-app #sidebar').invoke('attr', 'aria-expanded', 'false')

  //   landingPage.requestMoreCodes()
  //   cy.assert_current_url(request_codes_url)
  //   landingPage.getFormField('emailAddress').should('have.attr', 'value', 'zrana@edx.org')
  //   landingPage.getFormField('enterpriseName').should('have.attr', 'value', 'SuccessFactors')
  //   landingPage.getLabels('Company').should('have.text', 'Company*').children().should('have.class', 'required')
  //   landingPage.getLabels('Email').should('have.text', 'Email Address*').children().should('have.class', 'required')
  //   landingPage.getLabels('Number of Codes').should('have.text', 'Number of Codes')
  //   landingPage.getRequestCodesButton().should('have.attr', 'type', 'submit').should('have.text', 'Request Codes')
  //   landingPage.getCancelButton().should('have.attr', 'href', '/successfactors/admin/coupons').should('have.text', 'Cancel')
  //   landingPage.getFormField('emailAddress').clear().prev().click()
  //   landingPage.getInvalidFeedback().should('have.text', 'This field is required.')
  //   landingPage.getFormField('emailAddress').type('zrana@')
  //   landingPage.getInvalidFeedback().should('have.text', 'Must be a valid email address.')
  //   landingPage.getRequestCodesButton().should('have.attr', 'disabled')
  //   landingPage.getCancelButton().click()
  //   cy.assert_current_url('https://portal.stage.edx.org/successfactors/admin/coupons')
  //   landingPage.requestMoreCodes()
  //   cy.assert_current_url(request_codes_url)
  //   landingPage.getFormField('numberOfCodes').type('5')
  //   landingPage.getRequestCodesButton().click()
  //   cy.assert_current_url('https://portal.stage.edx.org/successfactors/admin/coupons')
  //   cy.get('.alert-dialog .message .title').should('have.text', 'Request for more codes received').next().should('have.text', 'The edX Customer Success team will contact you soon.')
  // })

  it('checks filter options and table headers', function () {
    landingPage.goToEnterprise('SuccessFactors')
    landingPage.openCodeManagement()
    codeManagementDashboard.getTableRow().click()
    codeManagementDashboard.getCouponDetailsRow().should('have.css', 'background-color', 'rgb(9, 86, 134)' )
    cy.check_labels('small.text-light', ["Coupon Name", "Valid From", "Valid To", "Assignments Remaining", "Enrollments Redeemed"])
    cy.check_labels('select[name="table-view"] option', ["Unassigned", "Unredeemed", "Partially Redeemed", "Enrollments Redeemed"])
    cy.check_labels('select[name="bulk-action"] option', ["Assign", "Remind", "Revoke"])
    codeManagementDashboard.getAssignActionButton().click()
    codeManagementDashboard.getModalWindow().then(function($win) {
      cy.wrap($win).find('.modal-footer .btn:nth-of-type(1)').should('have.text', 'Assign Code').next().should('have.text', 'Close')
      cy.wrap($win).find('h3').then((headings)=>{
        cy.check_labels(headings, ['Add User', 'Email Template'])
      })

      cy.wrap($win).find('.form-group [for]').then((field_labels)=>{
        cy.check_labels(field_labels, ['Email Address*', 'Customize Message*'])
      })
      cy.wrap($win).find('.form-group [for] span').each(($el, index, $list) => {
        cy.get($el).should('have.class', 'required')
      })
  })
})

//   it('checks the request codes form contents', function () {
//     const request_codes_url = 'https://portal.stage.edx.org/successfactors/admin/coupons/request'
//     let remainingRedemptions 
//     cy.server()

//     cy.route('GET','**/47059/codes/?code_filter=unassigned**').as('results')
//     landingPage.goToEnterprise('SuccessFactors')
//     landingPage.openCodeManagement()
//     codeManagementDashboard.getTableRow().click()
//     cy.wait("@results")

  
//     cy.check_labels('small.text-light', ["Coupon Name", "Valid From", "Valid To", "Assignments Remaining", "Enrollments Redeemed"])
//     cy.check_labels('select[name="table-view"] option', ["Unassigned", "Unredeemed", "Partially Redeemed", "Enrollments Redeemed"])
//     cy.check_labels('select[name="bulk-action"] option', ["Assign", "Remind", "Revoke"])
    
    
//     cy.get('@results').then((xhr)=>{
//       const responseBody = xhr.responseBody
//       this.remainingRedemptions = (responseBody['results'][0]['redemptions']['total'])
//       codeManagementDashboard.getRemainingAssignments().should('have.text', this.remainingRedemptions.toString())
//     })    
//     codeManagementDashboard.getAssignActionButton().click()
    
//     codeManagementDashboard.getModalWindow().then(function($win) {
//       cy.wrap($win).find('.modal-footer .btn:nth-of-type(1)').should('have.text', 'Assign Code').next().should('have.text', 'Close')
//       cy.wrap($win).find('input[name="email-address"]').type('zrana@edx.org')
//       cy.wrap($win).find('.modal-footer .btn:nth-of-type(1)').click()
//     })
//     codeManagementDashboard.getCodeAssignmentSuccessMessage().should('have.text', 'Successfully assigned code(s)')
  
//     codeManagementDashboard.getRemainingAssignments().then((elem)=>{
//       const text = elem.text()
//       expect((this.remainingRedemptions-1).toString()).to.eq(text)
//     })

//     codeManagementDashboard.getCodeStatusFilter().select('Unredeemed')
//     codeManagementDashboard.getRevokeButton().click()

//     codeManagementDashboard.getModalWindow().then(function($win) {
//       cy.wrap($win).find('.modal-footer .btn:nth-of-type(1)').click()
//     })
//     codeManagementDashboard.getRevokeSuccessMessage().should('have.text', 'Successfully revoked code(s)')


//   })
  
})