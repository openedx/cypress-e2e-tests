import EnterpriseCoupons from '../helpers/enterprise_coupons'

describe('Login tests', function () {
  const coupons = new EnterpriseCoupons()

  before(function () {
    let couponId
    let couponName = 'discount_single_course_single_use_percentage'
    coupons.loginToEcommerce()
    coupons.prepareCouponData(couponName).then((couponData) => {
      coupons.createCoupon(couponData[couponName]).then((response) => {
        this.couponId = response.body.coupon_id
      })
    })
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid', 'ecommerce_csrftoken', 'ecommerce_sessionid')
  })

  it('fetches coupon report', function () {
    cy.log(this.couponId)
    coupons.fetchCouponReport(this.couponId).then((response) => {
      cy.log(response.body)
    })
  })

  it('visits admin portal', function () {
    cy.visit('/')
  })

  after(function () {
    coupons.deleteCoupon(this.couponId)
  })
})