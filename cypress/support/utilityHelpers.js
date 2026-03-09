import { getCsrfToken, getRequestHeaders } from './apiHelpers'

export const searchReindex = (courseId) => {
  const url = `${Cypress.env('BASE_CMS_URL')}/course/${courseId}/search_reindex`
  return getCsrfToken().then(token => cy.request({
    method: 'GET',
    url,
    headers: getRequestHeaders(url, token),
  }))
}

// Helper: Get an offset date from today
export const getDateWithOffset = (daysAhead = 10) => {
  const date = new Date()
  date.setDate(date.getDate() + daysAhead)
  return date.toISOString()
}

// Format date as "Dec 31, 2025"
export const getFormattedDate = (isoDate) => {
  const date = new Date(isoDate)
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}
