class HomePage {
  pageTitle = '.sub-header-title'

  headerActions = '.sub-header-actions'

  createCourseForm = '.create-or-rerun-course-form'

  courseNameInput = 'input[name="displayName"]'

  organizationInput = 'input[name="org"]'

  courseNumberInput = 'input[name="number"]'

  courseRunInput = 'input[name="run"]'

  getPageTitle() {
    return cy.get(this.pageTitle)
  }

  getNewCourseButton() {
    return cy.get(this.headerActions).contains('button', 'New course')
  }

  getCreateCourseForm() {
    return cy.get(this.createCourseForm)
  }

  getCourseNameInput() {
    return cy.get(this.courseNameInput)
  }

  getOrganizationInput() {
    return cy.get(this.organizationInput)
  }

  getCourseNumberInput() {
    return cy.get(this.courseNumberInput)
  }

  getCourseRunInput() {
    return cy.get(this.courseRunInput)
  }

  getCreateCourseButton() {
    return cy.contains('button', 'Create')
  }

  createNewCourse(courseName, courseOrg, courseNumber, courseRun) {
    cy.intercept('POST', `${Cypress.env('BASE_CMS_URL')}/course/`).as('createCourse')
    this.getNewCourseButton().click()
    this.getCreateCourseForm().should('be.visible')
    this.getCourseNameInput().type(courseName)
    this.getOrganizationInput().type(courseOrg)
    this.getCourseNumberInput().type(courseNumber)
    this.getCourseRunInput().type(courseRun)

    this.getCreateCourseButton().should('not.be.disabled')
    this.getCreateCourseButton().click({ force: true })
    cy.wait('@createCourse')
    const courseId = `course-v1:${courseOrg}+${courseNumber}+${courseRun}`
    cy.url().should(
      'include',
      `/authoring/course/${courseId}`,
    )
    return courseId
  }
}

export default HomePage
