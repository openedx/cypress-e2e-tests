class CodeManagementPage {
  getFormField(fieldName) {
    return cy.get(`[name="${fieldName}"]`)
  }

  getLabels(labelName) {
    const labels = {Email: 1, Company: 2, Codes:3}
    return cy.get(`.form-group:nth-of-type(${labels[labelName]}) label`)
  }

  getRequestCodesButton(){
    return cy.get('.btn.btn-primary')
  }

  getCancelButton(){
    return cy.get('.btn.btn-link.ml-3.form-cancel-btn')
  }

  getInvalidFeedback(){
    return cy.get('[name="emailAddress"]~.invalid-feedback')
  }

  getSuccessMessage(){
      return cy.get('.alert-dialog .message')
  }

  requestMoreCodes(){
    cy.get('.request-codes-btn.btn.btn-primary').click()
  }

}

export default CodeManagementPage