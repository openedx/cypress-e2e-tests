class CourseAboutPage {
  courseName = '.info-profile h1'

  enrollNowButton = '.register'

  viewCourseButton = 'strong:nth-child(2)'

  courseTitle = '.course-card-title'

  imageCourse = '.hero > img'

  iconFacebook = '.social-sharing [href*="facebook.com"]'

  iconTwitter = '.social-sharing [href*="twitter.com"]'

  iconMail = '.social-sharing [href*="mailto:"]'

  classesStart = '.start-date'

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

  getIconTwitter() {
    return cy.get(this.iconTwitter)
  }

  getIconMail() {
    return cy.get(this.iconMail)
  }

  getClassesStart() {
    return cy.get(this.classesStart)
  }

  checkClassesStartDateFormat() {
    cy.get(this.classesStart)
      .invoke('text')
      .should('match', /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/)
  }

  checkCourseName(courseTitle) {
    cy.get(this.courseName).should('contain.text', courseTitle)
  }
}

export default CourseAboutPage
