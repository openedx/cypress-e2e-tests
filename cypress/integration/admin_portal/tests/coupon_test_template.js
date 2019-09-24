import EnterpriseCoupons from '../helpers/enterprise_coupons'
import HelperFunctions from '../helpers/helper_functions'

describe('Coupon Tests Template', function () {
  let couponId = null
  const coupons = new EnterpriseCoupons()

  before(function () {
    const couponName = 'enrollment_multi_use_per_customer'
    coupons.loginToEcommerce()
    coupons.prepareCouponData(couponName).then((couponData) => {
      coupons.createCoupon(couponData[couponName]).then((response) => {
        couponId = response.body.coupon_id
      })
    })
    coupons.findValidCatalogCourse()
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid', 'ecommerce_csrftoken', 'ecommerce_sessionid')
  })

  it('fetches coupon report', function () {
    cy.log(couponId)
    coupons.fetchCouponReport(couponId).then((response) => {
      const reportText = response.body
      cy.log(reportText)
      cy.log(HelperFunctions.readCouponData(reportText))
    })
  })

  after(function () {
    coupons.deleteCoupon(couponId)
  })
})
