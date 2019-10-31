declare namespace Cypress {
  interface Chainable<Subject> {
    login_using_api: typeof login_using_api
    register_using_api: typeof register_using_api
    login_from_ui: typeof login_from_ui
    make_payment: typeof make_payment
    check_labels: typeof check_labels
    upload_file: typeof upload_file
  }
}