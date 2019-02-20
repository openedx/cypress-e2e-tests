class EnterpriseDashboard {
  getLogoAltAttributes(logoContainer, attributeName, logoType = '/') {
    // This function takes parent container name, logo type and attribute name
    // as parameter and return attribute value
    return cy.get(logoContainer).find(`a[href="${logoType}"]>img`).invoke('attr', attributeName)
  }

  getFooterNavItems() {
    return cy.get('footer .nav-item .nav-link')
  }

  cardText(cardSequenceNumber) {
    return cy.get(`:nth-child(${cardSequenceNumber})>.number-card .card-text`)
  }

  cardTitle(cardSequenceNumber) {
    return cy.get(`:nth-child(${cardSequenceNumber})>.number-card .card-title>span:nth-child(1)`)
  }

  cardDetailedBreakdown(cardSequenceNumber) {
    return cy.get(`:nth-child(${cardSequenceNumber})>.number-card .card-footer .d-flex .label`)
  }

  tableHeaders() {
    return cy.get('.enrollments .table thead .btn-header>span')
  }

  specificTableHeader(columnNumber) {
    return cy.get(`.enrollments .table thead th:nth-child(${columnNumber}) .btn-header>span`)
  }
}

export default EnterpriseDashboard
