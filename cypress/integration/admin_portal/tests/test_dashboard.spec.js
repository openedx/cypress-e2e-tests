import LoginPage from '../pages/login_page'
import Dashboard from '../pages/dashboard_page'

describe('Login and Dashoboard tests', () => {
  const loginPage = new LoginPage()
  const dashboard = new Dashboard()

  beforeEach(() => {
    cy.visit('/')
  })

  it('does not allow non admin user access', () => {
    // Login as normal user
    loginPage.loginUser(Cypress.env('JOURNAL_USER_EMAIL'), Cypress.env('JOURNAL_USER_PASSWORD'))
    // Check that enterprise list container is not present
    dashboard.enterpriseListContainer().should('not.exist')
  })

  it('allows admin user to login and have access on dashboard components', () => {
    const logo = new RegExp('/ef7b61e5efb512ea4472f1c32fa17907.png')
    const footerLinksInfo = {
      'Terms of Service': '/edx-terms-service',
      'Privacy Policy': '/edx-privacy-policy',
      Support: '/public/support',
    }
    const ExpectedEnterprises = {
      ArbiSoft: '/arbisoft/admin/learners',
      'Bessie Test Inc': '/bessie-test-inc/admin/learners',
      Boeing: '/boeing/admin/learners',
      'Degreed Company': '/degreed-company/admin/learners',
      'Demo 1': '/demo-1/admin/learners',
      test: '/successfactors/admin/learners',
      'MA Corp': '/macorp/admin/learners',
      MattWLTest: '/mattwltest/admin/learners',
      Microsoft: '/microsoft/admin/learners',
      'OpenCraft Australia': '/opencraft-australia/admin/learners',
      'Owl Enterprise': '/owl-enterprise/admin/learners',
      'Pied Piper': '/pied-piper/admin/learners',
      'SuccessFactors QA Company': '/successfactors-qa-company/admin/learners',
      'Test Ent': '/test-ent/admin/learners',
      'Test New Enterprise': '/test-new-enterprise/admin/learners',
      TestDemoEnterpriseTest: '/testdemoenterprisetest/admin/learners',
      'Vandelay Industries (Direct Integration Test Company)': '/vandelay-industries-direct-int/admin/learners',
      'WhirlPool (edx)': '/whirlpooledx/admin/learners',
      Whirlpool: '/whirlpool/admin/learners',
      'test gdpr enterprise customer': '/test-gdpr-enterprise-customer/admin/learners',
    }
    // Login as admin user
    loginPage.loginUser(Cypress.env('ADMIN_PORTAL_USER_EMAIL'), Cypress.env('ADMIN_PORTAL_USER_PASSWORD'))
    // Check that enterprise list container is present
    dashboard.enterpriseListContainer().should('exist')
    // Check for presence of valid site logo in Header, also check alt text and logo name
    dashboard.getLogo('header')
      .should('have.attr', 'alt', 'edX logo')
      .and('have.attr', 'src')
      .and('match', logo)
    // Check for presence of valid site logo in Footer, also check alt text and logo name
    dashboard.getLogo('footer')
      .should('have.attr', 'alt', 'edX logo')
      .and('have.attr', 'src')
      .and('match', logo)
    // Check for the presence of valid text and links in footer section
    Object.keys(footerLinksInfo)
      .forEach(key => dashboard.verifyFooterInfo(key, footerLinksInfo[key]))
    // Check the names and urls of enterprises
    dashboard.enterpriseList().then((elems) => {
      const names = [...elems].map(el => el.textContent.trim())
      const urls = [...elems].map(el => el.getAttribute('href'))
      const enterprises = Object.assign({}, ...names.map((n, index) => ({ [n]: urls[index] })))
      expect(enterprises).to.deep.equal(ExpectedEnterprises)
    })
  })
})
