import LandingPage from '../pages/landing_page'
import CodeManagementPage from '../pages/enterprise_code_management'
import EnterpriseCoupons from '../helpers/enterprise_coupons'

describe('landing page tests', function () {
  const landingPage = new LandingPage()
  const codeManagementDashboard = new CodeManagementPage()
  const coupons = new EnterpriseCoupons()

  before(function () {
    cy.login_using_api(Cypress.env('ADMIN_USER_EMAIL'), Cypress.env('ADMIN_USER_PASSWORD'))
    const couponType = 'discount_single_use_absolute'
    coupons.LoginAsAdmin()
    coupons.prepareCouponData(couponType).then((couponData) => {
      const requestData = couponData
      requestData[couponType].quantity = '3'
      coupons.createCoupon(couponData[couponType]).then((response) => {
        this.couponId = response.body.coupon_id
      })
    })
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
    landingPage.goToEnterprise(Cypress.env('enterprise_name'))
    landingPage.openCodeManagement()
  })

  it('checks for the bulk assignment and revoking of the coupons', function () {
    cy.server()
    cy.route('GET', `**/${this.couponId}/codes/?code_filter=unassigned**`).as('results')
    coupons.fetchCouponReport(this.couponId).then((response) => {
      const couponReport = response.body
      const [couponName] = couponReport.match(/Test_Coupon_\w+/g)
      this.couponName = couponName
      codeManagementDashboard.getCoupon().contains(this.couponName).click()
    })
    // Asserts the redemption count of coupons before assignment
    cy.wait('@results').then((xhr) => {
      const responseBody = xhr.response.body
      this.remainingRedemptions = (responseBody.count)
      codeManagementDashboard.getCouponRows().should('have.length', this.remainingRedemptions.toString())
      // Check checkoxes for bulk assignment
      for (let rowIndex = 1; rowIndex < this.remainingRedemptions; rowIndex += 1) {
        codeManagementDashboard.selectCodesForBulkAssignment(rowIndex)
      }
    })
    // Click on Bulk Assign Code Button
    codeManagementDashboard.getBulkActionButton().click()
    // Verify Modal Window contents
    codeManagementDashboard.getModalWindow().within(() => {
      const fileName = 'valid_emails.csv'
      const fileType = 'application/csv'
      const fileSelector = '#csv-email-addresses'
      const modelWindowLabelsAndText = {
        modelLabel: 'Code Assignment',
        unassignedCodes: 'Unassigned Codes: ',
        selectedCodes: 'Selected Codes: ',
        helpEmailText: 'To add more than one user, enter one email address per line.',
        uploadCSVLabel: 'Upload Email Addresses',
        csvHelpText: 'The file must be a CSV containing a single column of email addresses.',
        maxNumbersEmailError: 'You have 2 codes selected, but you entered 3 emails. Please try again.',
        csvEmailValidationError: 'Unable to assign codesYou uploaded a CSV and manually entered email addresses. Please only use one of these fields.',
      }
      cy.get('.modal-title>span').should('have.text', this.couponName)
      cy.get('.modal-title>small').should('have.text', modelWindowLabelsAndText.modelLabel)
      cy.get('.modal-body>div>p:nth-child(1)').should('have.text', modelWindowLabelsAndText.unassignedCodes + this.remainingRedemptions)
      cy.get('.modal-body>div>p:nth-child(2)').should('have.text', modelWindowLabelsAndText.selectedCodes + (this.remainingRedemptions - 1))
      cy.get('#description-email-addresses').should('have.text', modelWindowLabelsAndText.helpEmailText)
      cy.get('#description-email-addresses').should('have.text', modelWindowLabelsAndText.helpEmailText)
      cy.get('.file-input>label').should('have.text', modelWindowLabelsAndText.uploadCSVLabel)
      cy.get('#description-csv-email-addresses').should('have.text', modelWindowLabelsAndText.csvHelpText)
      cy.get('textarea[name="email-addresses"]').type('cypress1@edx.org')
        .type('{enter}')
        .type('cypress2@edx.com')
        .type('{enter}')
        .type('cypress3@edx.org')
      cy.upload_file(fileName, fileType, fileSelector).then(() => {
        cy.get('.modal-footer .btn:nth-of-type(1)').click()
        cy.get('.alert-dialog .message').should('have.text', modelWindowLabelsAndText.csvEmailValidationError)
        cy.get('.remove-file-btn').click()
        cy.get('.modal-footer .btn:nth-of-type(1)').click()
        cy.get('#validation-email-addresses').should('have.text', modelWindowLabelsAndText.maxNumbersEmailError)
        cy.get('textarea[name="email-addresses"]').type('{selectall}')
          .type('cypress1@edx.org')
          .type('{enter}')
          .type('cypress2@edx.com')
        cy.get('.modal-footer .btn:nth-of-type(1)').click()
      })
    })
    // Assigns the code by submitting the email
    const expectedSuccessMessages = {
      codeAssigned: ['Successfully assigned code(s)', 'To view the newly assigned code(s), filter by', 'unredeemed codes.'],
    }
    cy.check_labels('.alert-success .message', expectedSuccessMessages.codeAssigned)
    // Asserts the redemption count of coupons after the assignment
    codeManagementDashboard.getCouponMeta().then((couponMeta) => {
      expect((this.remainingRedemptions - 2).toString()).to.eq(couponMeta.eq(3).text())
    })
    codeManagementDashboard.getCodeStatusFilter().select('Unredeemed')
    codeManagementDashboard.selectCodesForBulkRevoke()
    codeManagementDashboard.getBulkActionFilter().select('Revoke')
    codeManagementDashboard.getBulkActionButton().click()

    codeManagementDashboard.getModalWindow().then((win) => {
      cy.wrap(win).find('.modal-footer .btn:nth-of-type(1)').click()
    })
    codeManagementDashboard.getRevokeSuccessMessage().should('have.text', 'Successfully revoked code(s)')
  })
  after(function () {
    coupons.deleteCoupon(this.couponId)
  })
})
