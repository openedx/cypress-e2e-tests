import { getRequestHeaders } from '../../../support/apiHelpers'

class Settings {
  getSettings(url, token) {
    return cy.request({
      method: 'GET',
      url,
      headers: getRequestHeaders(url, token),
    })
  }

  setSettings(url, token, bodyData) {
    return cy.request({
      method: 'POST',
      url,
      headers: getRequestHeaders(url, token),
      body: bodyData,
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  }
}

export default Settings
