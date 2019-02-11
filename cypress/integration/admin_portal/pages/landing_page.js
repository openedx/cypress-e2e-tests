class LandingPage {
  // Check for logo presence in parent container and verify logo attributes
  verifyLogo(parentCss, logoAltText, logoName) {
    cy.get(parentCss)
      .find('a>img')
      .should('have.attr', 'alt', logoAltText)
      .and('have.attr', 'src')
      .and('match', logoName)
  }

  verifyFooterInfo(footerLinkText, footerLink) {
    cy.get('.footer-links')
      .contains('.nav-link', footerLinkText)
      .and('have.attr', 'href')
      .and('include', footerLink)
  }
}

export default LandingPage
