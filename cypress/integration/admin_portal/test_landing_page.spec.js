import LandingPage from './pages/landing_page'

describe('Landing Page Configurations', () => {
  const landingPage = new LandingPage()
  const logo = new RegExp('/ef7b61e5efb512ea4472f1c32fa17907.png')

  beforeEach(() => {
    cy.login_using_api(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
    // Use the above user session to login to Journals
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid')
    cy.visit('/')
  })

  it('Verfies the correct header components', () => {
    // Check for presence of valid site logo in Footer, also check alt text and logo name
    landingPage.verifyLogo('header', 'edX logo', logo)
  })

  it('Verfies the correct footer components', () => {
    const footerLinksInfo = {
      'Terms of Service': '/edx-terms-service',
      'Privacy Policy': '/edx-privacy-policy',
      Support: '/public/support',
    }
    // Check for presence of valid site logo in Footer, also check alt text and logo name
    landingPage.verifyLogo('footer', 'edX logo', logo)
    // Check for the presence of valid text and links in footer section
    Object.keys(footerLinksInfo)
      .forEach(key => landingPage.verifyFooterInfo(key, footerLinksInfo[key]))
  })
})
