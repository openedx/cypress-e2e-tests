import { getCsrfToken, getRequestHeaders } from '../../../support/apiHelpers'

class AdvancedSettings {
  url = `${Cypress.env('BASE_CMS_URL')}/settings/advanced/`

  // Method to get current advanced settings
  getSettings(url, token) {
    return cy.request({
      method: 'GET',
      url,
      headers: getRequestHeaders(url, token),
    })
  }

  // Method to set/update advanced settings
  setSettings(url, token, bodyData) {
    return cy.request({
      method: 'POST',
      url,
      headers: getRequestHeaders(url, token),
      body: bodyData,
    })
  }

  // Method to change specific advanced settings
  changeAdvancedSetting(url, sectionName, sectionData) {
    return getCsrfToken().then(token => this.getSettings(url, token)
      .then(response => response.body)
      .then(bodyData => {
        // eslint-disable-next-line no-param-reassign
        bodyData[sectionName].value = sectionData
        return this.setSettings(url, token, bodyData)
      }))
  }

  courseVisibility(courseId, value) {
    return this.changeAdvancedSetting(`${this.url}${courseId}`, 'catalog_visibility', value)
  }
}

export default AdvancedSettings
