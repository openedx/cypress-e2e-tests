class LandingPage {
  getLogoAltAttributes(logoContainer, attributeName, logoType = '/') {
    // This function takes parent container name, logo type and attribute name
    // as parameter and return attribute value
    return cy.get(logoContainer).find(`a[href="${logoType}"]>img`).invoke('attr', attributeName)
  }

  getFooterNavItems() {
    return cy.get('footer .nav-item .nav-link')
  }

  enterpriseListContainer() {
    return cy.get('.enterprise-list')
  }

  getEnterpriseList() {
    return cy.get('.enterprise-list td a')
  }

  goToEnterprise(enterpriseName) {
    // Open target enterprise page
    cy.get('.enterprise-list td>a').contains(enterpriseName).click()
    // Wait for page to load properly by verifying that dashboard cards are visible
    cy.get('.card').should('be.visible')
  }
}

export default LandingPage
