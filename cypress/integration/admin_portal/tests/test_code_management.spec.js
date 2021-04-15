import LandingPage from '../pages/landing_page'
import CodeManagementPage from '../pages/enterprise_code_management'
import EnterpriseCoupons from '../helpers/enterprise_coupons'
import HelperFunctions from '../helpers/helper_functions'

const requestCodeslabelsAndText = {
  companyLabel: 'Company*',
  emailLabel: 'Email Address*',
  numberOfCodesLabel: 'Number of Codes',
  requestCodesLabel: 'Request Codes',
  cancelLabel: 'Cancel',
  fieldRequiredError: 'This field is required.',
  validEmailError: 'Must be a valid email address.',
}

const labels = {
  couponHeaderLabels: ['Coupon Name', 'Valid From', 'Valid To', 'Assignments Remaining', 'Enrollments Redeemed'],
  codeStatusFilter: ['Unassigned', 'Unredeemed', 'Enrollments Redeemed'],
  bulkActionFilter: ['Assign', 'Remind', 'Revoke'],
  assignCouponHeadings: ['Add User', 'Email Template'],
  assignCouponFieldLabels: [
    'Email Address',
    'Template name',
    'Customize email eubject',
    'Customize greeting',
    'Body',
    'Customize closing'],
}

describe('coupon management tests', function () {
  const landingPage = new LandingPage()
  const codeManagementDashboard = new CodeManagementPage()
  const coupons = new EnterpriseCoupons()

  before(() => {
    cy.login_using_api(Cypress.env('ADMIN_USER_EMAIL'), Cypress.env('ADMIN_USER_PASSWORD'))
    const couponType = 'discount_single_use_percentage'
    coupons.LoginAsAdmin()
    coupons.prepareCouponData(couponType).then((couponData) => {
      coupons.createCoupon(couponData[couponType]).then((response) => {
        console.log(response)
        this.couponId = response.body.coupon_id
      })
    })
    console.log(this.couponId)
    // Coupon quanitity from the fixture
    cy.fixture('coupon_creation_data').then((couponData) => {
      this.quantity = couponData.discount_single_use_percentage.quantity
    })
  })

  beforeEach(() => {
    cy.login_using_api(Cypress.env('ADMIN_USER_EMAIL'), Cypress.env('ADMIN_USER_PASSWORD'))
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid', 'ecommerce_csrftoken', 'ecommerce_sessionid')
    cy.visit('/')
    landingPage.goToEnterprise(Cypress.env('enterprise_name'))
    landingPage.openCodeManagement()
  })
  it('prepopulates email address and enterprise name fields', () => {
    codeManagementDashboard.requestMoreCodes()
    codeManagementDashboard.getFormField('emailAddress').should('have.attr', 'value', Cypress.env('ADMIN_USER_EMAIL'))
    codeManagementDashboard.getFormField('enterpriseName').should('have.attr', 'value', Cypress.env('enterprise_name'))
  })

  it('Marks the correct fields as required REQUEST MORE CODES form', () => {
    codeManagementDashboard.requestMoreCodes()

    codeManagementDashboard.getLabels('Company').should('have.text', requestCodeslabelsAndText.companyLabel).children().should('have.class', 'required')
    codeManagementDashboard.getLabels('Email').should('have.text', requestCodeslabelsAndText.emailLabel).children().should('have.class', 'required')
    codeManagementDashboard.getLabels('Codes').should('have.text', requestCodeslabelsAndText.numberOfCodesLabel)
  })
  it('Has the correct buttons REQUEST MORE CODES form', () => {
    codeManagementDashboard.requestMoreCodes()

    codeManagementDashboard.getRequestCodesButton().should('have.attr', 'type', 'submit').and('have.text', requestCodeslabelsAndText.requestCodesLabel)
    codeManagementDashboard.getCancelButton().should('have.attr', 'href', `/${Cypress.env('enterprise_name').toLowerCase()}/admin/coupons`)
      .and('have.text', requestCodeslabelsAndText.cancelLabel)
  })
  it('Verifies the validation checks on REQUEST MORE CODES form', () => {
    codeManagementDashboard.requestMoreCodes()
    codeManagementDashboard.getFormField('emailAddress').type(' ')
    const emailFormField = codeManagementDashboard.getFormField('emailAddress')
    emailFormField.clear()
    // validation runs after the user clicks away
    codeManagementDashboard.getFormField('enterpriseName').click({ force: true })
    codeManagementDashboard.getInvalidFeedback().should('have.text', requestCodeslabelsAndText.fieldRequiredError)
    codeManagementDashboard.getFormField('emailAddress').type('test@')
    // validation runs after the user clicks away
    codeManagementDashboard.getFormField('enterpriseName').click({ force: true })
    codeManagementDashboard.getInvalidFeedback().should('have.text', requestCodeslabelsAndText.validEmailError)
    codeManagementDashboard.getRequestCodesButton().should('have.attr', 'disabled')
  })

  it('Verifies the correct functioning of REQUEST CODES form', () => {
    const urls = {
      requestCodes: '/admin/coupons/request',
      codeManagement: '/admin/coupons',
    }
    codeManagementDashboard.requestMoreCodes()
    cy.url().should('eq', `${Cypress.config().baseUrl}/${Cypress.env('enterprise_name').toLowerCase()}${urls.requestCodes}`)
    codeManagementDashboard.getCancelButton().click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/${Cypress.env('enterprise_name').toLowerCase()}${urls.codeManagement}`)
    codeManagementDashboard.requestMoreCodes()
    cy.url().should('eq', `${Cypress.config().baseUrl}/${Cypress.env('enterprise_name').toLowerCase()}${urls.requestCodes}`)
    //  Request for more codes
    codeManagementDashboard.getFormField('numberOfCodes').type('5')
    codeManagementDashboard.getRequestCodesButton().click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/${Cypress.env('enterprise_name').toLowerCase()}${urls.codeManagement}`)

    codeManagementDashboard.getSuccessMessage().then((successMessage) => {
      const successMessages = {
        successMessage1: 'Request for more codes received',
        successMessage2: 'The edX Customer Success team will contact you soon.',
      }
      const text = successMessage.text()
      expect(text).includes(successMessages.successMessage1)
      expect(text).includes(successMessages.successMessage2)
    })
  })

  describe('checks filter options and coupon metadata', () => {
    beforeEach(() => {
      coupons.fetchCouponReport(this.couponId).then((response) => {
        const couponReport = response.body
        const [couponName] = couponReport.match(/Test_Coupon_\w+/g)
        this.couponName = couponName
        this.dates = couponReport.match(/\w+ \d+, \d+/g)
        codeManagementDashboard.getCoupon().contains(this.couponName).click()
      })
    })
    it('verifies the metadata on the coupon table header', () => {
      codeManagementDashboard.getCouponMeta().then((couponInfo) => {
        // Coupon data from coupon report
        const couponMeta = {
          validCouponReportFromDate: HelperFunctions.convertDateToShortFormat(this.dates[1]),
          validCouponTableFromDate: HelperFunctions.convertDateToShortFormat(couponInfo.eq(1).text()),
          validCouponReportToDate: HelperFunctions.convertDateToShortFormat(this.dates[2]),
          validCouponTableToDate: HelperFunctions.convertDateToShortFormat(couponInfo.eq(2).text()),
          remainingAssignments: couponInfo.eq(3).text(),
          enrollmentsRedeemed: couponInfo.eq(4).text(),
        }
        expect(couponMeta.validCouponReportFromDate).to
          .eql(couponMeta.validCouponTableFromDate)
        expect(couponMeta.validCouponReportToDate).to
          .eql(couponMeta.validCouponTableToDate)
        expect(this.quantity).to.eql(couponMeta.remainingAssignments)
        expect(couponMeta.enrollmentsRedeemed).to.eql(`0 of ${couponMeta.remainingAssignments}(0%)`)
      })
    })
    it('checks the headers of the table and filter options', () => {
      codeManagementDashboard.getCouponDetailsRow()
      cy.check_labels('small.text-light', labels.couponHeaderLabels)
      cy.check_labels('select[name="table-view"] option', labels.codeStatusFilter)
      cy.check_labels('select[name="bulk-action"] option', labels.bulkActionFilter)
    })
    it('checks for the labels and required fields on the modal', () => {
      codeManagementDashboard.getAssignActionButton().click()
      codeManagementDashboard.getModalWindow().then(function ($win) {
        cy.wrap($win).find('.modal-footer .btn:nth-of-type(1)').should('have.text', 'Close').next()
          .should('have.text', 'Assign Code')
          .next()
          .should('have.text', 'Save Template')
        cy.wrap($win).find('h3').then((headings) => {
          cy.check_labels(headings, labels.assignCouponHeadings)
        })

        cy.wrap($win).find('pgn__form-group>[for]').then((fieldLabels) => {
          cy.check_labels(fieldLabels, labels.assignCouponFieldLabels)
        })
        cy.wrap($win).find('pgn__form-group [for] span').each(($el) => {
          cy.get($el).should('have.class', 'required')
        })
      })
    })
  })

  it('checks for the assignment and revoking of the coupons', () => {
    cy.server()
    const uniqueEmail = HelperFunctions.getUniqueEmailAlias()
    this.couponCode = null
    cy.route('GET', `**/${this.couponId}/codes/?code_filter=unassigned**`).as('results')
    coupons.fetchCouponReport(this.couponId).then((response) => {
      const couponReport = response.body
      const [couponName] = couponReport.match(/Test_Coupon_\w+/g)
      this.couponName = couponName
      codeManagementDashboard.getCoupon().contains(this.couponName).click()
    })
    // Asserts the redemption count of coupons before assignment
    cy.wait('@results').then((xhr) => {
      const responseBody = xhr.response.body
      const remainingRedemptions = (responseBody.results[0].redemptions.total)
      this.couponCode = (responseBody.results[0].code)
      codeManagementDashboard.getRemainingAssignments().should('have.text', remainingRedemptions.toString())
    })
    codeManagementDashboard.getAssignActionButton().click()
    // Assigns the code by submitting the email
    codeManagementDashboard.getModalWindow().then((win) => {
      cy.wrap(win).find('input[name="email-address"]').type(uniqueEmail)
      cy.wrap(win).find('.modal-footer .btn:nth-of-type(2)').click()

      codeManagementDashboard.getCodeAssignmentSuccessMessage().should(($successMessage) => {
        const expectedSuccessMessages = {
          codeAssigned: 'Successfully assigned code(s)',
          viewAssignedCode: 'To view the newly assigned code(s), filter by',
          linkText: 'unredeemed codes.',
        }
        const messages = $successMessage.text()
        expect(messages).includes(expectedSuccessMessages.codeAssigned)
        expect(messages).includes(expectedSuccessMessages.viewAssignedCode)
        expect($successMessage.children('.btn.btn-link')).to.have.text(expectedSuccessMessages.linkText)
      })
      codeManagementDashboard.getNoResultsMessage().then(($message) => {
        expect($message).to.eql('There are no results.')
      })
    })
    // commented out because it's not working
    // const mailOptions = {
    //   from: 'test@dev.edx.org',
    //   to: uniqueEmail,
    //   subject: 'New edX course assignment',
    //   tryLimit: 80,
    //   searchInterval: 80000,
    // }
    // cy.task('mailReader', mailOptions).then((email) => {
    //   expect(HelperFunctions.extractAccessCodeFromEmail(email)).to.eql(this.couponCode)
    // })
    codeManagementDashboard.getCodeStatusFilter().select('Unredeemed')
    codeManagementDashboard.getRevokeButton().click()

    codeManagementDashboard.getModalWindow().then((win) => {
      cy.wrap(win).find('.modal-footer .btn:nth-of-type(2)').click()
    })
    codeManagementDashboard.getRevokeSuccessMessage().should('have.text', 'Successfully revoked code(s)')
  })

  after(() => {
    coupons.deleteCoupon(this.couponId)
  })
})
