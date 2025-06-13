class DashboardPage {
  // --- Header locators ---
  headerBlock = '.site-header-desktop'

  headerLink = '.main-nav .nav-link'

  headerDropdownMenu = '.menu-trigger'

  dropdownItem = '.dropdown-item'

  logoIcon = '.logo'

  // --- Course dashboard locators ---
  courseActionsDropdown = '#course-actions-dropdown-card-0'

  unenrollToggle = '[data-testid="unenrollModalToggle"]'

  courseCard = '[data-testid="CourseCard"]'

  courseItem = '.courses-listing-item'

  courseTitle = '.course-title'

  learnMoreButton = '.learn-more'

  getPageHeader() {
    return cy.get(this.headerBlock)
  }

  checkHeaderLinks() {
    cy.get(this.headerLink).contains('Courses').should('exist').and('have.class', 'active')
    cy.get(this.headerLink).contains('Programs').should('exist')
    cy.get(this.headerLink).contains('Discover New').should('exist')
  }

  checkHeaderDropdownMenu() {
    cy.get(this.headerDropdownMenu).should('exist')
    cy.get(this.headerDropdownMenu).click()
    cy.get(this.dropdownItem).contains('Profile').should('be.visible')
    cy.get(this.dropdownItem).contains('Account').should('be.visible')
    cy.get(this.dropdownItem).contains('Sign Out').should('be.visible')
  }

  goToDashboardPage() {
    cy.get(this.logoIcon).click()
    cy.url().should('include', '/learner-dashboard')
  }

  goToProgramsPage() {
    cy.get(this.headerLink).contains('Programs').click()
    cy.url().should('include', '/programs')
  }

  getCourseAndEnroll(courseName) {
    cy.contains('Explore courses').click()

    cy.get(this.courseItem)
      .contains(this.courseTitle, courseName)
      .parents(this.courseItem)
      .find(this.learnMoreButton)
      .click()

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
    cy.contains('Unenroll from course?').should('be.visible')
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
}

export default DashboardPage
