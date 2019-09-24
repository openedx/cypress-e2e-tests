import EnterpriseCoupons from '../helpers/enterprise_coupons'
import EnableDataSharingConsent from '../helpers/data_sharing_consent'
import CouponApplication from '../helpers/coupon_application'

describe('Login tests', function () {
  const coupons = new EnterpriseCoupons()
  const couponApplication = new CouponApplication()
  const consent = new EnableDataSharingConsent()

  before(function () {
    coupons.loginToEcommerce()
    coupons.findValidCatalogCourse()
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid', 'ecommerce_csrftoken', 'ecommerce_sessionid')
  })

  it('applies coupon on LMS side', function () {
    cy.log(coupons.courseKey)
    cy.log(coupons.courseSku)
    consent.enableConsent(coupons.courseKey).then((response) => {
      cy.log(response)
      couponApplication.applyCoupon('PXHYIYAR7D56NLA2', coupons.courseSku).then((resp) => {
        cy.log(resp.body)
      })
    })
  })
})
