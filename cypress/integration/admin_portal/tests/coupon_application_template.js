import EnterpriseCoupons from '../helpers/enterprise_coupons'
import CouponApplication from '../helpers/coupon_application'

describe('Login tests', function () {
  const coupons = new EnterpriseCoupons()
  const couponApplication = new CouponApplication()

  before(function () {
    coupons.LoginAsAdmin()
    coupons.findValidCatalogCourse()
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid', 'ecommerce_csrftoken', 'ecommerce_sessionid')
  })

  it('applies coupon on LMS side', function () {
    couponApplication.loginAsStudent()
    couponApplication.enableConsent(coupons.courseKey).then((response) => {
      if (response.body.consent_provided === true) {
        couponApplication.applyCoupon('PXHYIYAR7D56NLA2', coupons.courseSku).then((resp) => {
          expect(resp.body).to.contain('Your order is complete. If you need a receipt, you can print this page')
        })
      }
    })
  })
})
