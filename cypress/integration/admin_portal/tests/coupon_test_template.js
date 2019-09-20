import EnterpriseCoupons from '../helpers/enterprise_coupons'

describe('Login tests', function () {
  let couponId = null
  const coupons = new EnterpriseCoupons()

  before(function () {
    const couponName = 'enrollment_single_course_multi_use_per_customer'
    coupons.loginToEcommerce()
    coupons.prepareCouponData(couponName).then((couponData) => {
      coupons.createCoupon(couponData[couponName]).then((response) => {
        couponId = response.body.coupon_id
      })
    })
    coupons.fetchValidCourseSKU()
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid', 'ecommerce_csrftoken', 'ecommerce_sessionid')
  })

  it('fetches coupon report', function () {
    cy.log(couponId)
    coupons.fetchCouponReport(couponId).then((response) => {
      cy.log(response.body)
    })
  })

  after(function () {
    coupons.deleteCoupon(couponId)
  })
})
