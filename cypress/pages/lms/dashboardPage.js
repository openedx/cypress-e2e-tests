class DashboardPage {
  // --- Header locators ---
  headerBlock = '.site-header-desktop'

  headerLink = '.main-nav .nav-link'

  headerDropdownMenu = '.menu-trigger'

  dropdownItem = '.dropdown-item'

  logoIcon = '.logo'

  lightDarkThemeSlider = '.slider'

  // --- Course dashboard locators ---
  courseActionsDropdown = '#course-actions-dropdown-card-0'

  unenrollToggle = '[data-testid="unenrollModalToggle"]'

  emailToggle = '[data-testid="emailSettingsModalToggle"]'

  receiveCourseEmailToggle = '.pgn__form-switch-input'

  courseCard = '[data-testid="CourseCard"]'

  courseItem = '.courses-listing-item'

  courseTitle = '.course-title'

  learnMoreButton = '.learn-more'

  viewAsSearchForm = '#form-field1'

  viewAsSubmitButton = 'button[type="submit"]'

  filterRefineContainer = '.course-filter-controls-container'

  courseFilterRefine = '#course-filter-controls'

  refineButton = 'button.btn-outline-primary'

  filterButton = '#course-filter-controls button'

  filterFormLabel = '.pgn__form-label'

  courseCardTitle = '[data-testid="CourseCardTitle"]'

  courseCardImage = '.pgn__card-image-cap'

  courseCardDetails = '[data-testid="CourseCardDetails"]'

  alertCardMessage = '.alert-message-content'

  viewCourseButton = '[data-test-id="CourseCardActions"] a.btn'

  // --- Footer locators ---
  footerBlock = 'footer'

  getPageHeader() {
    return cy.get(this.headerBlock)
  }

  getPageFooter() {
    return cy.get(this.footerBlock)
  }

  checkMainHeaderLinks() {
    cy.get(this.headerLink).contains('Courses').should('exist').and('have.class', 'active')
    cy.get(this.headerLink).contains('Discover New').should('exist')
  }

  checkProgramsHeaderLink() {
    cy.get(this.headerLink).contains('Programs').should('exist')
  }

  checkHeaderDropdownMenu() {
    cy.get(this.headerDropdownMenu).should('exist')
    cy.get(this.headerDropdownMenu).click()
    cy.get(this.dropdownItem).contains('Profile').should('be.visible')
    cy.get(this.dropdownItem).contains('Account').should('be.visible')
    cy.get(this.dropdownItem).contains('Sign Out').should('be.visible')
  }

  getHelpLink() {
    return cy.get(this.headerBlock).contains('a', 'Help')
  }

  goToProfilePageFromDropdown() {
    cy.get(this.headerDropdownMenu).click()
    cy.get(this.dropdownItem).contains('Profile').click()
    cy.url().should('include', '/profile/u/')
  }

  goToDashboardPageFromDropdown() {
    cy.get(this.headerDropdownMenu).click()
    cy.get(this.dropdownItem).contains('Dashboard').click()
    cy.url().should('include', '/learner-dashboard')
  }

  goToAccountPageFromDropdown() {
    cy.get(this.headerDropdownMenu).click()
    cy.get(this.dropdownItem).contains('Account').click()
    cy.url().should('include', '/account')
  }

  signoutUser() {
    cy.get(this.headerDropdownMenu).click()
    cy.get(this.dropdownItem).contains('Sign Out').click()
    cy.get(this.headerDropdownMenu).should('not.exist')
    cy.contains('Register for free').should('be.visible')
    cy.contains('Sign in').should('be.visible')
  }

  goToDashboardPage() {
    cy.get(this.logoIcon).click()
    cy.url().should('include', '/learner-dashboard')
  }

  goToProgramsPage() {
    cy.get(this.headerLink).contains('Programs')
      .should('be.visible')
      .and('have.attr', 'href')
      .and('include', '/programs')

    cy.get(this.headerLink).contains('Programs').click()
    cy.url().should('include', '/programs')
  }

  goToDiscoverPage() {
    cy.get(this.headerLink).contains('Discover New')
      .should('be.visible')
      .and('have.attr', 'href')
      .and('include', '/courses')

    cy.get(this.headerLink).contains('Discover New').click()
    cy.url().should('include', '/courses')
  }

  selectCourse(courseName) {
    cy.get(this.courseItem)
      .contains(this.courseTitle, courseName)
      .parents(this.courseItem)
      .find(this.learnMoreButton)
      .click()
  }

  getCourseAndEnroll(courseName) {
    cy.contains('Explore courses').click()
    this.selectCourse(courseName)

    cy.get('.register')
      .contains('Enroll Now')
      .click()
  }

  courseUnenroll() {
    cy.get(this.courseActionsDropdown).click()

    cy.get(this.unenrollToggle)
      .should('be.visible')
      .and('contain', 'Unenroll')
      .and('have.attr', 'role', 'button')

    cy.intercept('POST', '/change_enrollment').as('unenroll')
    cy.contains('Unenroll').click()
    // cy.contains('Unenroll from course?').should('be.visible')
    cy.contains('button', 'Unenroll').click()
    cy.contains('Skip survey').should('be.visible').click()
    cy.contains('You are unenrolled').should('be.visible')
    cy.contains('button', 'Return to dashboard').click()
    cy.wait('@unenroll')
  }

  getDisplayUnenrollButtonAndCancel() {
    cy.get(this.courseActionsDropdown).click()

    cy.get(this.unenrollToggle)
      .should('be.visible')
      .and('contain', 'Unenroll')
      .and('have.attr', 'role', 'button')

    cy.contains('Unenroll').click()
    cy.contains('Unenroll from course?').should('be.visible')
    cy.contains('Never mind').should('be.visible').click()
  }

  getEmailSettings() {
    cy.get(this.courseActionsDropdown).click()

    cy.get(this.emailToggle)
      .should('be.visible')
      .and('contain', 'Email settings')
      .and('have.attr', 'role', 'button')

    cy.contains('Email settings').click()
    cy.contains('Receive course emails?').should('be.visible')

    cy.contains('Course emails are on').should('be.visible')
    cy.get(this.receiveCourseEmailToggle).click()
    cy.contains('Course emails are off').should('be.visible')
    cy.contains('Never mind').should('be.visible').click()
  }

  getSearchBarForm() {
    return cy.get(this.viewAsSearchForm)
  }

  getSearchBarLabel() {
    return cy.contains('label', 'Username or email')
  }

  getSubmitViewAsButtonExist() {
    cy.get(this.viewAsSubmitButton)
      .should('contain', 'Submit')
      .should('be.disabled')
  }

  getSubmitViewAsButtonEnableWhenUserInput() {
    cy.get(this.viewAsSearchForm).type('test')

    cy.get(this.viewAsSubmitButton)
      .should('contain', 'Submit')
      .should('not.be.disabled')
      .should('have.class', 'btn-brand')

    cy.get(this.viewAsSearchForm).clear()
  }

  getSubmitAsExistLearner() {
    cy.get(this.viewAsSearchForm)
      .should('be.visible')
      .type(Cypress.env('LMS_USER_EMAIL'))
      .should('have.value', Cypress.env('LMS_USER_EMAIL'))

    cy.get(this.viewAsSubmitButton)
      .should('not.be.disabled')
      .click()
  }

  getRefineButton() {
    cy.get(this.filterRefineContainer)
      .should('exist')
      .and('be.visible')

    cy.get(this.courseFilterRefine)
      .should('exist')
      .within(() => {
        cy.get(this.refineButton)
          .should('contain', 'Refine')
      })
  }

  checkFilterByCourseStatus() {
    cy.get(this.filterButton).click()
    const testFilters = ['In-Progress', 'Not Started', 'Done', 'Not Enrolled', 'Upgraded']

    testFilters.forEach(filter => {
      cy.contains(this.filterFormLabel, filter)
        .click()
    })
  }

  checkSortCourses() {
    cy.get(this.courseCard).then($cards => {
      const initialCount = $cards.length

      cy.get(this.filterButton).click()
      const testSort = ['Last enrolled', 'Title (A-Z)']

      testSort.forEach(sort => {
        cy.contains(this.filterFormLabel, sort).click()
      })

      cy.get(this.courseCard).should('have.length', initialCount)
    })
  }

  clearAllFilters() {
    cy.get(this.filterButton).click()
    const testFilters = ['In-Progress']

    testFilters.forEach(filter => {
      cy.contains(this.filterFormLabel, filter)
        .click()
    })
    cy.contains('Clear all').click()
  }

  checkCourseTitle() {
    cy.get(this.courseCardTitle).should('exist')
  }

  checkCourseImage() {
    cy.get(this.courseCardImage).should('exist')
  }

  checkCourseDetails() {
    cy.get(this.courseCardDetails).should('exist')
  }

  checkAllertMessageContent() {
    cy.get(this.alertCardMessage)
      .should('exist')
      .and('be.visible')
  }

  getViewCourseButtons() {
    return cy.get(this.viewCourseButton)
  }

  checkViewCourseButtons(expectedButtons = []) {
    this.getViewCourseButtons().then($buttons => {
      const labels = [...$buttons].map(btn => btn.innerText.trim())
      // eslint-disable-next-line no-unused-expressions
      expect(labels.every(label => expectedButtons.includes(label))).to.be.true
    })
  }

  checkCourseLearningPage() {
    this.getViewCourseButtons().first().click()
    cy.url().should('include', '/learning/course')
  }
}

export default DashboardPage
