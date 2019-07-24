class CodeManagementPage {

    getTableRow() {
      return cy.get('.coupon').contains('Test M by M')
    }
  
    getCouponDetailsRow() {
      return cy.get('.expanded .metadata.row')
    }

    getCouponDetailsRowText() {
        return cy.get('small.text-light')
    }

    getFilterOptions(){
        return cy.get('select[name="table-view"] option')
    }

    getCodeStatusFilter(){
        return cy.get('select[name="table-view"]')
    }

    getBulkActionFilter(){
        return cy.get('select[name="bulk-action"] option')
    }

    getAssignActionButton(){
        return cy.get('.table tbody tr:nth-of-type(1) .btn')
    }

    getRemainingAssignments(){
        return cy.get('.table tbody tr:nth-of-type(1) td:nth-of-type(4)')
    }

    getModalWindow(){
        return cy.get('.modal-content')
    }

    getCodeAssignmentSuccessMessage(){
        return cy.get('.message .title')
    }

    getRevokeButton(){
        return cy.get('.revoke-btn')
    }

    getRevokeSuccessMessage(){
       return cy.get('.alert.fade:nth-of-type(1) .message')
    }

}
  
  export default CodeManagementPage
  