// Get domain from BASE_CMS_URL
export const getDomain = () => {
  const studioUrl = new URL(Cypress.env('BASE_CMS_URL'))
  return studioUrl.hostname
}

// Get CSRF token from cookies
export const getCsrfToken = () => cy.getAllCookies() // gets all cookies from browser
  .then((allCookiesArray) => {
    const csrfCookie = allCookiesArray.find( // filter by domain and cookie name
      (cookieObj) => cookieObj.domain === getDomain()
        && cookieObj.name === 'csrftoken',
    )
    return csrfCookie.value
  })

// Generate headers with CSRF token for requests
export const getRequestHeaders = (refer, token) => ({
  Referer: refer,
  'X-CSRFToken': token,
  Accept: 'application/json, text/javascript, */*; q=0.01',
})
