class EnableDataSharingConsent {
  constructor() {
    this.defaultHeaders = {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8,ur;q=0.7',
      'Content-Type': 'application/json',
      Referer: `${Cypress.env('lms_url')}/consent/api/v1/data_sharing_consent`,
      'X-Csrftoken': null,
      'X-Requested-With': 'XMLHttpRequest',
    }
  }

  enableConsent(courseKey) {
    cy.request(`${Cypress.env('lms_url')}/courses/`)
    cy.getCookie('csrftoken')
      .should('exist').then((csrfVal) => {
        this.defaultHeaders['X-Csrftoken'] = csrfVal.value
      })
    const enableConsentUrl = `${Cypress.env('lms_url')}/consent/api/v1/data_sharing_consent`
    cy.log(enableConsentUrl)
    const params = {
      username: 'Kashif',
      course_id: courseKey,
      enterprise_customer_uuid: Cypress.env('enterprise_id'),
    }
    return cy.request({
      method: 'POST',
      url: enableConsentUrl,
      headers: this.defaultHeaders,
      body: params,
    })
  }
}

export default EnableDataSharingConsent
