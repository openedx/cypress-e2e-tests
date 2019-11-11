const uuidv4 = require('uuid/v4')

function getDates() {
  // const dates = {};
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - 3);
  // dates.start_date = targetDate.toISOString();
  targetDate.setDate(targetDate.getDate() + 20);
  // dates.end_date = targetDate.toISOString();
  const dates = {
    start_date: targetDate.toISOString(),
    end_date : targetDate.toISOString()
  }
  return dates;
}

export class EnterpriseCoupons {
  coursesku: null;
  coursekey: null;
  defaultHeaders: { Accept: string; 'Accept-Encoding': string; 'Accept-Language': string; 'Content-Type': string; Referer: string; Origin: any; 'X-Csrftoken': null; 'X-Requested-With': string; };
  constructor() {
    this.coursesku = null
    this.coursekey = null
    this.defaultHeaders = {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8,ur;q=0.7',
      'Content-Type': 'application/json',
      Referer: `${Cypress.env('ecommerce_url')}/enterprise/coupons/new/`,
      Origin: Cypress.env('ecommerce_url'),
      'X-Csrftoken': null,
      'X-Requested-With': 'XMLHttpRequest',
    }
  }

  LoginAsAdmin() {
    cy.login_using_api(Cypress.env('ADMIN_USER_EMAIL'), Cypress.env('ADMIN_USER_PASSWORD'))
    cy.request(`${Cypress.env('ecommerce_url')}/coupons/`)
  }

  prepareCouponData(coupon: string | number) {
    const randomString = uuidv4().substr(-11)
    const couponTitle = `Test_Coupon_${randomString}`
    return cy.fixture('coupon_creation_data').then((couponData) => {
      const requestBody = couponData
      requestBody[coupon].title = couponTitle
      requestBody[coupon].enterprise_customer.id = Cypress.env('enterprise_id')
      requestBody[coupon].enterprise_customer.name = Cypress.env('enterprise_name')
      requestBody[coupon].enterprise_customer_catalog = Cypress.env('enterprise_catalog')
      requestBody[coupon].start_datetime = getDates().start_date
      requestBody[coupon].end_datetime = getDates().end_date
    })
  }

  createCoupon(requestBody: string | object | undefined) {
    cy.getCookie('ecommerce_csrftoken')
      .should('exist').then((csrfVal: any) => {
        this.defaultHeaders['X-Csrftoken'] = csrfVal.value
      })
    const createCouponUrl = `${Cypress.env('ecommerce_url')}/api/v2/enterprise/coupons/`
    return cy.request({
      method: 'POST',
      url: createCouponUrl,
      body: requestBody,
      headers: this.defaultHeaders,
    })
  }

  fetchCouponReport(couponId: any) {
    const fetchCouponUrl = `${Cypress.env('ecommerce_url')}/api/v2/coupons/coupon_reports/${couponId}/`
    return cy.request({
      method: 'GET',
      url: fetchCouponUrl,
    })
  }

  findValidCatalogCourse() {
    const enterpriseCatalogUrl = `${Cypress.env('ecommerce_url')}/api/v2/enterprise/customer_catalogs/${Cypress.env('enterprise_catalog')}`
    cy.request(enterpriseCatalogUrl).then((response) => {
      const { results } = response.body
      const skuCourse = results.filter(function (result: { first_enrollable_paid_seat_sku: any; }) {
        return result.first_enrollable_paid_seat_sku
      })[0]
      this.coursesku = skuCourse.first_enrollable_paid_seat_sku
      this.coursekey = skuCourse.key
    })
  }

  deleteCoupon(couponId: any) {
    cy.getCookie('ecommerce_csrftoken')
      .should('exist').then((csrfVal: any) => {
        this.defaultHeaders['X-Csrftoken'] = csrfVal.value
      })
    const fetchCouponUrl = `${Cypress.env('ecommerce_url')}/api/v2/enterprise/coupons/${couponId}/`
    cy.getCookie('ecommerce_csrftoken')
      .should('exist').then((csrfVal: any) => {
        this.defaultHeaders['X-Csrftoken'] = csrfVal.value
        this.defaultHeaders.Referer = fetchCouponUrl
      })
    cy.request({
      method: 'DELETE',
      url: fetchCouponUrl,
      headers: this.defaultHeaders,
    })
  }
}

// export default EnterpriseCoupons
