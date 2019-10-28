import {EnterpriseCoupons} from '../helpers/enterprise_coupons';

describe('Coupon Tests Template', function () {
  let couponId: any = null
  const coupons: EnterpriseCoupons = new EnterpriseCoupons()

  before(function () {
    const couponName = 'enrollment_multi_use_per_customer'
    coupons.LoginAsAdmin()
    coupons.prepareCouponData(couponName).then((couponData: { [x: string]: any; }) => {
      coupons.createCoupon(couponData[couponName]).then((response: { body: { coupon_id: any; }; }) => {
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
    coupons.fetchCouponReport(couponId).then((response: any) => {
      const reportText = response.body
      cy.log(reportText)
      // cy.log(HelperFunctions.readCouponData(reportText))
    })
  })

  after(function () {
    coupons.deleteCoupon(couponId)
  })
})
