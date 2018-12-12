// Common functions

// Expand TOC Item
export const expandTocItem = listItem =>
  cy.get(listItem)
    .find('button').first()
    .should('have.attr', 'aria-expanded', 'false')
    .click()
    .should('have.attr', 'aria-expanded', 'true')

export const verifyTocItemName = (TocItemCss, TocItemName) =>
  cy.get(TocItemCss)
    .find('a').first()
    .should('have.text', TocItemName)

// Check for logo presence in parent container and verify logo attributes
export const verifyLogo = (parentCss, logoAltText, logoName) => {
  cy.get(parentCss)
    .find('.site-logo')
    .should('have.attr', 'alt', logoAltText)
    .and('have.attr', 'src')
    .and('match', logoName)
}

// check the page title and highlighted toc item
export const verifyPageTitle = (pageTitle) => {
  cy.get('.article-title').should('have.text', pageTitle)
  cy.get('.toc .highlight a').should('have.text', pageTitle)
}

// go to a specific page
export const goToPage = (capterName, pageTitle) => {
  cy.contains('#side-nav-panel-toggle', 'Content').click()
  // Expand target chapter
  cy.contains('.toc>ul>li', capterName).as('chapter')
  expandTocItem('@chapter')
  // Click on target page
  cy.get('@chapter').find('a').contains(pageTitle).click()
  // Check the Title of page and higlighted toc item
  verifyPageTitle(pageTitle)
}
