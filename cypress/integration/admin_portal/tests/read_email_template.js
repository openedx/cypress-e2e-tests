import HelperFunctions from '../helpers/helper_functions'

describe('Email assertion:', () => {
  it('Gets the email on basis of a search query', function () {
    const mailOptions = {
      from: 'activate@edx.org',
      to: HelperFunctions.getUniqueEmailAlias(),
      subject: 'Activate',
    }
    cy.task('mailReader', mailOptions).then((email) => {
      cy.log(HelperFunctions.extractUrlFromEmail(email, 'activate'))
    })
  })
})
