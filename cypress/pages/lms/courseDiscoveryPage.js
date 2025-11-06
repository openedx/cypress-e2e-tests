class CourseDiscoveryPage {
  courseItem = '.courses-listing-item'

  courseTitle = '.course-title'

  learnMoreButton = '.learn-more'

  courseCard = '[class^=courses-listing-item]'

  searchBar = 'input#discovery-input'

  searchButton = '.discovery-submit'

  discoveryMessage = '#discovery-message'

  clearFiltersButton = '#filter-bar .active-filter'

  getAllCourses() {
    return cy.get(this.courseItem)
  }

  getCoursesCount() {
    return cy.get(this.courseItem).its('length')
  }

  getSearchBar() {
    return cy.get(this.searchBar)
  }

  getDiscoveryMessage() {
    return cy.get(this.discoveryMessage)
  }

  checkPlaceholder() {
    return this.getSearchBar().should('have.attr', 'placeholder')
  }

  getCourseCard() {
    return cy.get(this.courseCard)
  }

  searchCourse(searchString) {
    cy.intercept('POST', '/search/course_discovery/').as(
      'getSearch',
    )
    cy.get(this.searchBar).invoke('val', searchString)
    cy.get(this.searchButton).click()
    return cy.wait('@getSearch')
  }

  verifyCourseAfterSearch(courseName, courseOrg, courseCode, courseStartDate) {
    cy.get(this.courseItem)
      .contains(this.courseTitle, courseName)
      .parents(this.courseItem)
      .should('be.visible')
      .within(() => {
        cy.get('.course-code').should('contain', courseCode)
        cy.get('.course-organization').should('contain', courseOrg)
        cy.get('.course-date').should('contain', courseStartDate)
      })
  }

  selectCourse(courseName) {
    cy.get(this.courseItem)
      .contains(this.courseTitle, courseName)
      .parents(this.courseItem)
      .find(this.learnMoreButton)
      .click()
  }

  checkDiscoveryMessageCounter() {
    cy.get(this.courseItem).then($cards => {
      const cardsCount = $cards.length
      this.getDiscoveryMessage().invoke('text').then((text) => {
        const match = text.match(/Viewing (\d+) courses?/)
        // eslint-disable-next-line no-unused-expressions
        expect(match).to.not.be.null
        const messageCount = Number(match[1])
        expect(messageCount).to.equal(cardsCount)
      })
    })
  }

  clearSearch() {
    cy.get(this.clearFiltersButton).click()
    cy.get(this.clearFiltersButton).should('not.exist')
    cy.get(this.searchBar).should('have.value', '')
  }
}

export default CourseDiscoveryPage
