import EnterpriseCoupons from '../helpers/enterprise_coupons'
import HelperFunctions from '../helpers/helper_functions'

describe('Coupon Tests Template', function () {
  const coupons = new EnterpriseCoupons()

  before(function () {
    const couponName = 'enrollment_multi_use_per_customer'
    coupons.LoginAsAdmin()
    coupons.prepareCouponData(couponName).then((couponData) => {
      coupons.createCoupon(couponData[couponName]).then((response) => {
        cy.wrap(response.body.coupon_id).as('couponId')
      })
    })
    // coupons.findValidCatalogCourse()
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce(
      'edxloggedin',
      'stage-edx-user-info',
      'stage-edx-sessionid',
      'ecommerce_csrftoken',
      'ecommerce_sessionid',
    )
  })

  it.skip('fetches coupon report', function () {
    cy.get('@couponId').then((couponId) => {
      cy.log(couponId)
      coupons.fetchCouponReport(couponId).then((response) => {
        const reportText = response.body
        cy.log(reportText)
        cy.log(HelperFunctions.readCouponData(reportText))
      })
    })
  })

  after(function () {
    cy.get('@couponId').then((couponId) => {
      coupons.deleteCoupon(couponId)
    })
  })
})
