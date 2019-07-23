const uuidv4 = require('uuid/v4')

function getDates() {
  let dates = {}
  let target_date = new Date()
  target_date.setDate(target_date.getDate() - 3)
  dates.start_date = target_date.toISOString()
  target_date.setDate(target_date.getDate() + 20)
  dates.end_date = target_date.toISOString()
  return dates
}


class EnterpriseCoupons {

  loginToEcommerce() {
    let token
    cy.login_using_api(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
    cy.request(`${Cypress.env('ecommerce_url')}/coupons/`)
    cy.getCookie('ecommerce_csrftoken')
      .should('exist').then((csrf_val) => {
        this.token = csrf_val
      })
  }

  prepareCouponData(coupon) {
    cy.fixture('coupon_creation_data').as('couponRequestBody')
    const randomString = uuidv4().substr(-11)
    const couponTitle = `Test_Coupon_${randomString}`
    return cy.get('@couponRequestBody').then((requestBody) => {
      requestBody[coupon]['title'] = couponTitle
      requestBody[coupon]['enterprise_customer']['id'] = Cypress.env('enterprise_id')
      requestBody[coupon]['enterprise_customer']['name'] = Cypress.env('enterprise_name')
      requestBody[coupon]['enterprise_customer_catalog'] = Cypress.env('enterprise_catalog')
      requestBody[coupon]['start_datetime'] = getDates().start_date
      requestBody[coupon]['end_datetime'] = getDates().end_date
    })
  }

  createCoupon(requestBody) {
    let createCouponUrl = `${Cypress.env('ecommerce_url')}/api/v2/enterprise/coupons/`
    return cy.request({
      method: 'POST',
      url: createCouponUrl,
      body: requestBody,
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8,ur;q=0.7',
        'Content-Type': 'application/json',
        Referer: `${Cypress.env('ecommerce_url')}/enterprise/coupons/new/`,
        Origin: Cypress.env('ecommerce_url'),
        'X-Csrftoken': this.token.value,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
  }

  fetchCouponReport(couponId) {
    const fetchCouponUrl = `${Cypress.env('ecommerce_url')}/api/v2/coupons/coupon_reports/${couponId}/`
    return cy.request({
      method: 'GET',
      url: fetchCouponUrl,
    })
  }

  deleteCoupon(couponId) {
    const fetchCouponUrl = `${Cypress.env('ecommerce_url')}/api/v2/enterprise/coupons/${couponId}/`
    cy.request({
      method: 'DELETE',
      url: fetchCouponUrl,
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8,ur;q=0.7',
        'Content-Type': 'application/json',
        Referer: `${Cypress.env('ecommerce_url')}/api/v2/enterprise/coupons/${couponId}/`,
        Origin: Cypress.env('ecommerce_url'),
        'X-Csrftoken': this.token.value,
        'X-Requested-With': 'XMLHttpRequest'
      },
    })
  }

}

export default EnterpriseCoupons
