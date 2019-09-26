
class CouponApplication {
  constructor() {
    this.userName = null
    this.postHeaders = {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8,ur;q=0.7',
      'Content-Type': 'application/json',
      Referer: `${Cypress.env('lms_url')}/consent/api/v1/data_sharing_consent`,
      'X-Csrftoken': null,
      'X-Requested-With': 'XMLHttpRequest',
    }
    this.getHeaders = {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8,ur;q=0.7',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
    }
  }

  loginToLMS() {
    cy.clearCookies()
    cy.login_using_api(Cypress.env('LMS_USER_EMAIL'), Cypress.env('LMS_USER_PASSWORD'))
  }

  enableConsent(courseKey) {
    cy.request(`${Cypress.env('lms_url')}/courses/`)
    cy.log(`${Cypress.env('lms_url')}/courses/`)
    cy.getCookie('csrftoken')
      .should('exist').then((csrfVal) => {
        this.postHeaders['X-Csrftoken'] = csrfVal.value
      })
    return cy.request(`${Cypress.env('lms_url')}/api/user/v1/accounts`).then((response) => {
      const params = {
        username: response.body[0].username,
        course_id: courseKey,
        enterprise_customer_uuid: Cypress.env('enterprise_id'),
      }
      return cy.request({
        method: 'POST',
        url: `${Cypress.env('lms_url')}/consent/api/v1/data_sharing_consent`,
        headers: this.postHeaders,
        body: params,
      })
    })
  }

  applyCoupon(couponId, courseSku) {
    const applyCouponUrl = `${Cypress.env('ecommerce_url')}/coupons/redeem/?code=${couponId}&sku=${courseSku}`
    return cy.request({
      method: 'GET',
      url: applyCouponUrl,
      headers: this.getHeaders,
    })
  }
}

export default CouponApplication
