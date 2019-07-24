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

  it('checks filter options and table headers', function () {
    landingPage.goToEnterprise('SuccessFactors')
    landingPage.openCodeManagement()
    codeManagementDashboard.getTableRow().click()
    codeManagementDashboard.getCouponDetailsRow().should('have.css', 'background-color', 'rgb(9, 86, 134)' )
    // Checks for the headers of the table and the options in filters
    cy.check_labels('small.text-light', ["Coupon Name", "Valid From", "Valid To", "Assignments Remaining", "Enrollments Redeemed"])
    cy.check_labels('select[name="table-view"] option', ["Unassigned", "Unredeemed", "Partially Redeemed", "Enrollments Redeemed"])
    cy.check_labels('select[name="bulk-action"] option', ["Assign", "Remind", "Revoke"])
    codeManagementDashboard.getAssignActionButton().click()
    // Checks for the labels and requried fields on the modal
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

  it('checks for the assignment and revoking of the coupons', function () {
    const request_codes_url = 'https://portal.stage.edx.org/successfactors/admin/coupons/request'
    let remainingRedemptions 
    cy.server()

    cy.route('GET','**/47059/codes/?code_filter=unassigned**').as('results')
    landingPage.goToEnterprise('SuccessFactors')
    landingPage.openCodeManagement()
    codeManagementDashboard.getTableRow().click()
    cy.wait("@results")

    // Asserts the redemption count of coupons before assignment
    cy.get('@results').then((xhr)=>{
      const responseBody = xhr.responseBody
      this.remainingRedemptions = (responseBody['results'][0]['redemptions']['total'])
      codeManagementDashboard.getRemainingAssignments().should('have.text', this.remainingRedemptions.toString())
    })    
    codeManagementDashboard.getAssignActionButton().click()
    
    // Assigns the code by submitting the email
    codeManagementDashboard.getModalWindow().then(function($win) {
      cy.wrap($win).find('input[name="email-address"]').type('zrana@edx.org')
      cy.wrap($win).find('.modal-footer .btn:nth-of-type(1)').click()
    })
    codeManagementDashboard.getCodeAssignmentSuccessMessage().should('have.text', 'Successfully assigned code(s)')
  
    // Asserts the redemption count of coupons after the assignment
    codeManagementDashboard.getRemainingAssignments().then((elem)=>{
      const text = elem.text()
      expect((this.remainingRedemptions-1).toString()).to.eq(text)
    })

    codeManagementDashboard.getCodeStatusFilter().select('Unredeemed')
    codeManagementDashboard.getRevokeButton().click()

    codeManagementDashboard.getModalWindow().then(function($win) {
      cy.wrap($win).find('.modal-footer .btn:nth-of-type(1)').click()
    })
    codeManagementDashboard.getRevokeSuccessMessage().should('have.text', 'Successfully revoked code(s)')
  })
})