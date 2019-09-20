import EnterpriseCoupons from '../helpers/enterprise_coupons'
import CouponApplication from '../helpers/coupon_application'

describe('Login tests', function () {
  const coupons = new EnterpriseCoupons()
  const couponApplication = new CouponApplication()

  before(function () {
    coupons.loginToEcommerce()
    coupons.findValidCourseSKU()
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid', 'ecommerce_csrftoken', 'ecommerce_sessionid')
  })

  it('applies coupon on LMS side', function () {
    couponApplication.applyCoupon('QECUBI7YS2TPABN7', coupons.sku).then((response) => {
      cy.log(response.body)
    })
  })
})
