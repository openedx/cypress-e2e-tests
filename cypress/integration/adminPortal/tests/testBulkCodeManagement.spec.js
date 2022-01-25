import LandingPage from '../pages/landingPage'
import CodeManagementPage from '../pages/enterpriseCodeManagement'
import EnterpriseCoupons from '../helpers/enterpriseCoupons'

const modalWindowLabelsAndText = {
  unassignedCodes: 'Unassigned codes: ',
  selectedCodes: 'Selected codes: ',
  helpEmailText: 'To add more than one user, enter one email address per line.',
  uploadCSVLabel: 'Upload Email Addresses',
  csvHelpText: 'The file must be a CSV containing a single column of email addresses.',
  maxNumbersEmailError: 'WarningUnable to assign codesYou have 2 codes selected, but you entered 3 emails. Please try again.',
  csvMaxEmailError: 'WarningUnable to assign codesYou have 2 codes selected, but your file has 3 emails. Please try again.',
  noEmailError: 'WarningUnable to assign codesNo email addresses provided. Either manually enter email addresses or upload a CSV file.',
}

const MODAL_ERROR_ALERT_SELECTOR = '.alert.alert-danger'

describe('bulk code management tests', function () {
  const landingPage = new LandingPage()
  const codeManagementDashboard = new CodeManagementPage()
  const coupons = new EnterpriseCoupons()
  let coupon
  let remainingRedemptions

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
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid', 'ecommerce_csrftoken', 'ecommerce_sessionid', 'lms_sessionid')
    cy.visit('/')
    landingPage.goToEnterprise(Cypress.env('enterprise_name'))
    landingPage.openCodeManagement()
    cy.server()
    cy.route('GET', `**/${this.couponId}/codes/?code_filter=unassigned**`).as('results')
    coupons.fetchCouponReport(this.couponId).then((response) => {
      const couponReport = response.body
      const [couponName] = couponReport.match(/Test_Coupon_\w+/g)
      coupon = couponName
      codeManagementDashboard.getCoupon().contains(coupon).click()
    })
    // Asserts the redemption count of coupons before assignment
    cy.wait('@results').then((xhr) => {
      const responseBody = xhr.response.body
      remainingRedemptions = (responseBody.count)
      codeManagementDashboard.getCouponRows().should('have.length', remainingRedemptions.toString())
      // Check checkoxes for bulk assignment
      for (let rowIndex = 1; rowIndex < remainingRedemptions; rowIndex += 1) {
        codeManagementDashboard.selectCodesForBulkAssignment(rowIndex)
      }
    })
    // Click on Bulk Assign Code Button
    codeManagementDashboard.getBulkActionButton().click()
  })
  it('has the correct inputs', () => {
    codeManagementDashboard.getModalWindow().within(() => {
      cy.get('.modal-title').should('have.text', coupon)
      cy.get('.modal-body>div>p:nth-child(1)').should('have.text', modalWindowLabelsAndText.unassignedCodes + remainingRedemptions)
      cy.get('.modal-body>div>p:nth-child(2)').should('have.text', modalWindowLabelsAndText.selectedCodes + (remainingRedemptions - 1))
      cy.get('#email-addresses-help-text').should('have.text', modalWindowLabelsAndText.helpEmailText)
      cy.get('.file-input>label').should('have.text', modalWindowLabelsAndText.uploadCSVLabel)
      cy.get('#csv-email-addresses-help-text').should('have.text', modalWindowLabelsAndText.csvHelpText)
      cy.get('.modal-title').should('have.text', coupon)
    })
  })
  it('renders a max number of emails error', () => {
    codeManagementDashboard.getModalWindow().within(() => {
      cy.get('textarea[name="email-addresses"]').type('cypress1@edx.org')
        .type('{enter}')
        .type('cypress2@edx.com')
        .type('{enter}')
        .type('cypress3@edx.org')
      cy.get('.modal-footer .btn:nth-of-type(2)').click()
      cy.get('.alert.alert-danger').should('have.text', modalWindowLabelsAndText.maxNumbersEmailError)
      cy.get('textarea[name="email-addresses"]').clear()
    })
  })

  it('renders a csv max emails error', () => {
    codeManagementDashboard.getModalWindow().within(() => {
      const fileSelector = '.choose-file-btn.btn~input'
      const fileName = 'valid_emails.csv'

      cy.get(fileSelector).attachFile(fileName)
      cy.get('.file-name').should('have.text', 'valid_emails.csv')
      cy.get('.modal-footer .btn:nth-of-type(2)').click()
      cy.get(MODAL_ERROR_ALERT_SELECTOR).should('have.text', modalWindowLabelsAndText.csvMaxEmailError)
      cy.get('.remove-file-btn').click()
    })
  })
  it('renders a no emails error', () => {
    codeManagementDashboard.getModalWindow().within(() => {
      cy.get('.modal-footer .btn:nth-of-type(2)').click()
      cy.get(MODAL_ERROR_ALERT_SELECTOR).should('have.text', modalWindowLabelsAndText.noEmailError)
    })
  })
  it('checks for the bulk assignment and revoking of the coupons success', function () {
    // Verify Modal Window contents
    codeManagementDashboard.getModalWindow().within(() => {
      cy.get('textarea[name="email-addresses"]').type('{selectall}')
        .type('cypress1@edx.org')
        .type('{enter}')
        .type('cypress2@edx.com')
      cy.get('.modal-footer .btn:nth-of-type(2)').click()
    })
    codeManagementDashboard.getModalWindow().should('not.be.visible')
    // Assigns the code by submitting the email
    const expectedSuccessMessages = {
      codeAssigned: ['Successfully assigned code(s)', 'To view the newly assigned code(s), filter by', 'unredeemed codes.'],
    }
    cy.check_labels('.alert-success .message', expectedSuccessMessages.codeAssigned)
    // This assertion is skipped for now
    // Asserts the redemption count of coupons after the assignment
    // codeManagementDashboard.getCouponMeta().then((couponMeta) => {
    //   expect((remainingRedemptions - 2).toString()).to.deep.eq(couponMeta.eq(3).text())
    // })
    codeManagementDashboard.getCodeStatusFilter().select('Unredeemed')
    codeManagementDashboard.selectCodesForBulkRevoke()
    codeManagementDashboard.getBulkActionFilter().select('Revoke')
    codeManagementDashboard.getBulkActionButton().click()

    codeManagementDashboard.getModalWindow().then((win) => {
      cy.wrap(win).find('.modal-footer .btn:nth-of-type(2)').click()
    })
    codeManagementDashboard.getRevokeSuccessMessage().should('have.text', 'Successfully revoked code(s)')
  })
  after(function () {
    coupons.deleteCoupon(this.couponId)
  })
})
