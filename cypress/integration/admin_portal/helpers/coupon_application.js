
class CouponApplication {
  loginToLMS() {
    cy.clearCookies()
    cy.login_using_api(Cypress.env('LMS_USER_EMAIL'), Cypress.env('LMS_USER_PASSWORD'))
  }

  defaultHeaders() {
    return {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8,ur;q=0.7',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
    }
  }

  applyCoupon(couponId, courseSku) {
    this.loginToLMS()
    cy.log(courseSku)
    const applyCouponUrl = `${Cypress.env('ecommerce_url')}/coupons/redeem/?code=${couponId}&sku=${courseSku}`
    return cy.request({
      method: 'GET',
      url: applyCouponUrl,
      headers: this.defaultHeaders(),
    })
  }
}

export default CouponApplication
