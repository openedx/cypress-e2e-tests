import LandingPage from '../pages/landing_page'
import CodeManagementPage from '../pages/enterprise_code_management'
import EnterpriseCoupons from '../helpers/enterprise_coupons'
import HelperFunctions from '../helpers/helper_functions'

describe('landing page tests', function () {
  const landingPage = new LandingPage()
  const codeManagementDashboard = new CodeManagementPage()
  const coupons = new EnterpriseCoupons()

  before(function () {
    const couponType = 'discount_single_use_absolute'
    coupons.LoginAsAdmin()
    coupons.prepareCouponData(couponType).then((couponData) => {
      const requestData = couponData
      requestData[couponType].quantity = '1'
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

  it('Validate the coupon report data', function () {
    cy.server()
    cy.route('GET', `**/api/v2/enterprise/coupons/${this.couponId}/codes.csv/?code_filter=unassigned**`).as('unassignedresults')
    cy.route('GET', `**/api/v2/enterprise/coupons/${this.couponId}/codes.csv/?code_filter=unredeemed**`).as('assignedresults')
    coupons.fetchCouponReport(this.couponId).then((response) => {
      const couponReport = response.body
      const [couponName] = couponReport.match(/Test_Coupon_\w+/g)
      this.couponName = couponName
      codeManagementDashboard.getCoupon().contains(this.couponName).click()
      // Click on Download Coupon Report Button
      codeManagementDashboard.downloadCouponReport()
    })
    // Check CSV data before assignment
    cy.wait('@unassignedresults').then((xhr) => {
      const responseBody = xhr.response.body
      const reportData = HelperFunctions.parseReportData(responseBody)
      expect(reportData.assigned_to).to.eql('')
      codeManagementDashboard.getCouponCode(3).should('have.text', reportData.redeem_url)
    })
    codeManagementDashboard.getAssignActionButton().click()
    // Assigns the code by submitting the email
    codeManagementDashboard.getModalWindow().then((win) => {
      cy.wrap(win).find('input[name="email-address"]').type('cypressTestEmail@edx.org')
      cy.wrap(win).find('.modal-footer .btn:nth-of-type(1)').click()
    })
    codeManagementDashboard.getCodeStatusFilter().select('Unredeemed')
    codeManagementDashboard.downloadCouponReport()
    // Check CSV data after assignment
    cy.wait('@assignedresults').then((xhr) => {
      const responseBody = xhr.response.body
      const reportData = HelperFunctions.parseReportData(responseBody)
      expect(reportData.assigned_to).to.eql('cypressTestEmail@edx.org')
      // codeManagementDashboard.getCouponCode(4).should('have.text', reportData.code)
    })
  })

  after(function () {
    coupons.deleteCoupon(this.couponId)
  })
})
