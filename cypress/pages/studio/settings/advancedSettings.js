import Settings from './settings'
import { getCsrfToken } from '../../../support/apiHelpers'

class AdvancedSettings extends Settings {
  url = `${Cypress.env('BASE_CMS_URL')}/settings/advanced/`

  // Method to change specific advanced settings if they differ from current settings
  changeAdvancedSetting(url, sectionName, sectionData) {
    return getCsrfToken().then(token => this.getSettings(url, token)
      .then(response => response.body)
      .then(bodyData => {
        const updated = { ...bodyData, [sectionName]: { ...bodyData[sectionName], value: sectionData } }
        return this.setSettings(url, token, updated)
      }))
  }

  setCourseVisibility(courseId, value) {
    return this.changeAdvancedSetting(`${this.url}${courseId}`, 'catalog_visibility', value)
  }
}

export default AdvancedSettings
