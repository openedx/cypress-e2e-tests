class LandingPage {
  getLogoAltAttributes(logoContainer, attributeName, logoType = '/') {
    // This function takes parent container name, logo type and attribute name
    // as parameter and return attribute value
    return cy.get(logoContainer).find(`a[href="${logoType}"]>img`).invoke('attr', attributeName)
  }

  getFooterNavItems() {
    return cy.get('footer .nav-item .nav-link')
  }

  getUserEmail() {
    return cy.get('header .navbar .dropdown-menu').invoke('attr', 'aria-label')
  }

  enterpriseListContainer() {
    return cy.get('.enterprise-list')
  }

  getEnterpriseList() {
    return cy.get('.enterprise-list td a')
  }

  getRequestCodesButton(){
    return cy.get('[class="btn btn-primary"]')
  }

  getCancelButton(){
    return cy.get('[class="btn btn-link ml-3 form-cancel-btn"]')
  }

  getInvalidFeedback(){
    return cy.get('[name="emailAddress"]~.invalid-feedback')
  }

  searchEnterprise(enterpriseName) {
    cy.server()
    cy.route(`**search=${enterpriseName}**`).as('results')
    cy.get('input[type="search"]').clear().type(`${enterpriseName}{enter}`)
    cy.wait('@results')
  }

  goToEnterprise(enterpriseName) {
    // Open target enterprise page
    cy.get('.enterprise-list td>a').contains(enterpriseName).click()
    // Wait for page to load properly by verifying that dashboard cards are visible
    cy.get('.card').should('be.visible')
  }

  logoutUser() {
    cy.get('header .navbar .dropdown-toggle')
      .should('have.attr', 'aria-expanded', 'false')
      .click()
      .should('have.attr', 'aria-expanded', 'true')
    cy.get('header .navbar .dropdown-item')
      .contains('Logout')
      .click()
  }

  openCodeManagement(){
    cy.get('.rounded-0:nth-of-type(2) .text-secondary.rounded-0').trigger('mouseover').click()
  }

  requestMoreCodes(){
    cy.get('[class="request-codes-btn btn btn-primary"]').click()
  }

  getFormField(field_name) {
    var css = (`[name="${field_name}"]`)
    return cy.get(css)
  }

  getLabels(label_name) {
    var labels = {'Email': 1, 'Company': 2, 'Number of Codes':3}
    var label_index = labels[label_name]
    var css = (`.form-group:nth-of-type(${label_index}) label`)
    return cy.get(css)
  }
}

export default LandingPage
