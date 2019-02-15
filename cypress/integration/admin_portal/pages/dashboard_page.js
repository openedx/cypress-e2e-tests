class Dashboard {
  // Check for logo presence in parent container and verify logo attributes
  getLogo(parentCss) {
    return cy.get(parentCss).find('a>img')
  }

  verifyFooterInfo(footerLinkText, footerLink) {
    cy.get('.footer-links')
      .contains('.nav-link', footerLinkText)
      .and('have.attr', 'href')
      .and('include', footerLink)
  }

  enterpriseListContainer() {
    return cy.get('.enterprise-list')
  }

  enterpriseList() {
    return cy.get('.enterprise-list td a')
  }
}

export default Dashboard
