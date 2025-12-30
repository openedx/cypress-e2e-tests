class CourseAboutPage {
  courseName = '.heading-group h1'

  enrollNowButton = '.register'

  viewCourseButton = 'strong:nth-child(2)'

  courseTitle = '.course-card-title'

  imageCourse = '.hero > img'

  iconFacebook = '.social-sharing [href*="facebook.com"]'

  iconTwitter = '.social-sharing [href*="twitter.com"]'

  iconMail = '.social-sharing [href*="mailto:"]'

  classesStart = '.start-date'

  classesEnd = '.final-date'

  getEnrollNowButton() {
    return cy.get(this.enrollNowButton)
  }

  getViewCourseButton() {
    return cy.get(this.viewCourseButton)
  }

  getCourseTitle() {
    return cy.get(this.courseTitle)
  }

  getCourseImage() {
    return cy.get(this.imageCourse)
  }

  getIconFacebook() {
    return cy.get(this.iconFacebook)
  }

  checkFacebookShareLink() {
    cy.get(this.iconFacebook)
      .should('have.attr', 'href')
      .and('include', 'facebook.com')
  }

  getIconTwitter() {
    return cy.get(this.iconTwitter)
  }

  checkTwitterShareLink() {
    cy.get(this.iconTwitter)
      .should('have.attr', 'href')
      .and('include', 'twitter.com')
  }

  getIconMail() {
    return cy.get(this.iconMail)
  }

  getClassesStart() {
    return cy.get(this.classesStart)
  }

  getClassesEnd() {
    return cy.get(this.classesEnd)
  }

  checkClassesStartDateFormat() {
    cy.get(this.classesStart)
      .invoke('text')
      .should('match', /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/)
  }

  checkCourseName(courseTitle) {
    cy.get(this.courseName).should('contain.text', courseTitle)
  }

  verifyStartDate(expectedDateTime) {
    return this.getClassesStart()
      .should('be.visible')
      .invoke('attr', 'data-datetime')
      .then((dateTimeOnAboutPage) => {
        expect(new Date(dateTimeOnAboutPage).toDateString())
          .to.eq(new Date(expectedDateTime).toDateString())
      })
  }

  verifyEndDate(expectedDateTime) {
    return this.getClassesEnd()
      .should('be.visible')
      .invoke('attr', 'data-datetime')
      .then((dateTimeOnAboutPage) => {
        expect(new Date(dateTimeOnAboutPage).toDateString())
          .to.eq(new Date(expectedDateTime).toDateString())
      })
  }
}

export default CourseAboutPage
