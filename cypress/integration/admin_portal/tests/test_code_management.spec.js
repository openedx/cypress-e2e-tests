import LandingPage from '../pages/landing_page'
import CodeManagementPage from '../pages/enterprise_code_management'
import EnterpriseCoupons from '../helpers/enterprise_coupons'
import HelperFunctions from '../helpers/helper_functions'

describe('landing page tests', function () {
  const landingPage = new LandingPage()
  const codeManagementDashboard = new CodeManagementPage()
  const coupons = new EnterpriseCoupons()

  before(function () {
    const couponType = 'discount_single_use_percentage'
    coupons.loginToEcommerce()
    coupons.prepareCouponData(couponType).then((couponData) => {
      coupons.createCoupon(couponData[couponType]).then((response) => {
        this.couponId = response.body.coupon_id
      })
    })
    // Coupon quanitity from the fixture
    cy.fixture('coupon_creation_data').then((couponData) => {
      this.quantity = couponData.discount_single_course_single_use_percentage.quantity
    })
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('edxloggedin', 'stage-edx-user-info', 'stage-edx-sessionid', 'ecommerce_csrftoken', 'ecommerce_sessionid')
    cy.visit('/')
    landingPage.goToEnterprise(Cypress.env('enterprise_name'))
    landingPage.openCodeManagement()
  })

  it('Verifies the validation checks on REQUEST MORE CODES form', function () {
    const labelsAndText = {
      companyLabel: 'Company*',
      emailLabel: 'Email Address*',
      numberOfCodesLabel: 'Number of Codes',
      requestCodesLabel: 'Request Codes',
      cancelLabel: 'Cancel',
      fieldRequiredError: 'This field is required.',
      validEmailError: 'Must be a valid email address.',
    }
    codeManagementDashboard.requestMoreCodes()
    codeManagementDashboard.getFormField('emailAddress').should('have.attr', 'value', Cypress.env('ADMIN_USER_EMAIL'))
    codeManagementDashboard.getFormField('enterpriseName').should('have.attr', 'value', Cypress.env('enterprise_name'))
    codeManagementDashboard.getLabels('Company').should('have.text', labelsAndText.companyLabel).children().should('have.class', 'required')
    codeManagementDashboard.getLabels('Email').should('have.text', labelsAndText.emailLabel).children().should('have.class', 'required')
    codeManagementDashboard.getLabels('Codes').should('have.text', labelsAndText.numberOfCodesLabel)
    codeManagementDashboard.getRequestCodesButton().should('have.attr', 'type', 'submit').and('have.text', labelsAndText.requestCodesLabel)
    codeManagementDashboard.getCancelButton().should('have.attr', 'href', `/${Cypress.env('enterprise_name').toLowerCase()}/admin/coupons`)
      .and('have.text', labelsAndText.cancelLabel)
    codeManagementDashboard.getFormField('emailAddress').clear().prev().click()
    codeManagementDashboard.getInvalidFeedback().should('have.text', labelsAndText.fieldRequiredError)
    codeManagementDashboard.getFormField('emailAddress').type('test@')
    codeManagementDashboard.getInvalidFeedback().should('have.text', labelsAndText.validEmailError)
    codeManagementDashboard.getRequestCodesButton().should('have.attr', 'disabled')
  })

  it('Verifies the correct functioning of REQUEST CODES form', function () {
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

  it('checks filter options and coupon metadata', function () {
    const labels = {
      couponHeaderLabels: ['Coupon Name', 'Valid From', 'Valid To', 'Assignments Remaining', 'Enrollments Redeemed'],
      codeStatusFilter: ['Unassigned', 'Unredeemed', 'Enrollments Redeemed'],
      bulkActionFilter: ['Assign', 'Remind', 'Revoke'],
      assignCouponHeadings: ['Add User', 'Email Template'],
      assignCouponFieldLabels: ['Email Address*', 'Customize Message*'],
    }
    coupons.fetchCouponReport(this.couponId).then((response) => {
      const couponReport = response.body
      const [couponName] = couponReport.match(/Test_Coupon_\w+/g)
      this.couponName = couponName
      this.dates = couponReport.match(/\w+ \d+, \d+/g)
      codeManagementDashboard.getCoupon().contains(this.couponName).click()
    })
    // Verify the metadata on the coupon table header
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
    codeManagementDashboard.getCouponDetailsRow()
    codeManagementDashboard.getCouponDetailsRow().should('have.css', 'background-color', 'rgb(9, 86, 134)')
    // Checks for the headers of the table and the options in filters
    cy.check_labels('small.text-light', labels.couponHeaderLabels)
    cy.check_labels('select[name="table-view"] option', labels.codeStatusFilter)
    cy.check_labels('select[name="bulk-action"] option', labels.bulkActionFilter)
    codeManagementDashboard.getAssignActionButton().click()
    // Checks for the labels and requried fields on the modal
    codeManagementDashboard.getModalWindow().then(function ($win) {
      cy.wrap($win).find('.modal-footer .btn:nth-of-type(1)').should('have.text', 'Assign Code').next()
        .should('have.text', 'Close')
      cy.wrap($win).find('h3').then((headings) => {
        cy.check_labels(headings, labels.assignCouponHeadings)
      })

      cy.wrap($win).find('.form-group [for]').then((fieldLabels) => {
        cy.check_labels(fieldLabels, labels.assignCouponFieldLabels)
      })
      cy.wrap($win).find('.form-group [for] span').each(($el) => {
        cy.get($el).should('have.class', 'required')
      })
    })
  })

  it('checks for the assignment and revoking of the coupons', function () {
    cy.server()
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
      this.remainingRedemptions = (responseBody.results[0].redemptions.total)
      codeManagementDashboard.getRemainingAssignments().should('have.text', this.remainingRedemptions.toString())
    })
    codeManagementDashboard.getAssignActionButton().click()
    // Assigns the code by submitting the email
    codeManagementDashboard.getModalWindow().then((win) => {
      cy.wrap(win).find('input[name="email-address"]').type('cypressTestEmail@edx.org')
      cy.wrap(win).find('.modal-footer .btn:nth-of-type(1)').click()

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
        // Asserts the redemption count of coupons after the assignment
        codeManagementDashboard.getCouponMeta().then((couponMeta) => {
          expect((this.remainingRedemptions - 1).toString()).to.eq(couponMeta.eq(3).text())
        })
      })
    })
    codeManagementDashboard.getCodeStatusFilter().select('Unredeemed')
    codeManagementDashboard.getRevokeButton().click()

    codeManagementDashboard.getModalWindow().then((win) => {
      cy.wrap(win).find('.modal-footer .btn:nth-of-type(1)').click()
    })
    codeManagementDashboard.getRevokeSuccessMessage().should('have.text', 'Successfully revoked code(s)')
  })

  after(function () {
    coupons.deleteCoupon(this.couponId)
  })
})
