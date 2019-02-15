import JournalCms from '../helpers/journal_creation'

describe('Verify User Enrollment', () => {
  beforeEach(() => {
    const chapterInfo = {
      chapter_seq_no: 87,
      title: 'Chapter-4',
      sub_title: 'Temp Chapter',
      type: 'raw_html',
      content: 'This is a temporary chapter added for e2e cypress tests',
    }
    const htmlPage = {
      page_seq_no: 135,
      title: '4-1',
      sub_title: 'HTML Chapter',
      type: 'raw_html',
      content: 'This is a Raw HTML Page',
    }
    const cms = new JournalCms()
    cms.loginAsStaff()
    cms.initializeStudio()
    cms.createPage(
      chapterInfo.chapter_seq_no,
      chapterInfo.title,
      chapterInfo.sub_title,
      chapterInfo.type,
      chapterInfo.content,
    )
    cms.createSubPage(
      chapterInfo.chapter_seq_no,
      htmlPage.page_seq_no,
      htmlPage.title,
      htmlPage.sub_title,
      htmlPage.type,
      htmlPage.content,
    )
  })

  it('enrols new user in journal', () => {
    // Click on the Journal card
    // cy.create_new_Journal_page()
    cy.visit('/')
    // Check for the presence of Login button
    cy.get('.header-actions')
      .find('.btn')
      .should('have.text', 'Login')
    // cy.create_new_Journal_page()
  })
})
