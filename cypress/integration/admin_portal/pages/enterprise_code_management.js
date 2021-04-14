class CodeManagementPage {
  getFormField(fieldName) {
    return cy.get(`[name="${fieldName}"]`)
  }

  getLabels(labelName) {
    const labels = { Email: 1, Company: 2, Codes: 3 }
    return cy.get(`.pgn__form-group:nth-of-type(${labels[labelName]}) label`)
  }

  getRequestCodesButton() {
    return cy.get('.btn.btn-primary')
  }

  getCancelButton() {
    return cy.get('.btn.btn-link.ml-3.form-cancel-btn')
  }

  getInvalidFeedback() {
    return cy.get('[name="emailAddress"]~.pgn__form-text-invalid')
  }

  getSuccessMessage() {
    return cy.get('.alert-dialog .message')
  }

  requestMoreCodes() {
    cy.get('.request-codes-btn.btn.btn-primary').click()
  }

  getCoupon() {
    return cy.get('.coupon')
  }

  downloadCouponReport() {
    cy.get('.download-btn').click()
  }

  getCouponCode(columnNumber) {
    return cy.get(`.coupon-details-table td:nth-child(${columnNumber})`)
  }

  getCouponDetailsRow() {
    return cy.get('.expanded .metadata.row')
  }

  getFilterOptions() {
    return cy.get('select[name="table-view"] option')
  }

  getCodeStatusFilter() {
    return cy.get('select[name="table-view"]').first()
  }

  getBulkActionFilter() {
    return cy.get('select[name="bulk-action"]')
  }

  getBulkActionButton() {
    return cy.get('.bulk-actions button')
  }

  getAssignActionButton() {
    return cy.get('.table tbody tr:nth-of-type(1) .btn')
  }

  getRemainingAssignments() {
    return cy.get('.table tbody tr:nth-of-type(1) td:nth-of-type(4)')
  }

  getCouponRows() {
    return cy.get('.table tbody tr')
  }

  selectCodesForBulkAssignment(rowNumber) {
    cy.get(`.table tbody tr:nth-of-type(${rowNumber}) .form-check label`).click()
  }

  selectCodesForBulkRevoke() {
    cy.get('label[id="label-select-all-codes"]').click()
  }

  getModalWindow() {
    return cy.get('.modal-content')
  }

  getCodeAssignmentSuccessMessage() {
    return cy.get('.alert-success .message')
  }

  getRevokeButton() {
    return cy.get('.revoke-btn')
  }

  getBulkRevokeButton() {
    return cy.get('.revoke-btn')
  }

  getRevokeSuccessMessage() {
    return cy.get('.alert.fade:nth-of-type(1) .message')
  }

  getNoResultsMessage() {
    return cy.get('.alert-warning .message').invoke('text')
  }

  getCouponMeta() {
    return cy.get('.text-light~div')
  }
}

export default CodeManagementPage
