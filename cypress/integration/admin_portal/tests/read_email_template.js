import HelperFunctions from '../helpers/helper_functions'

describe('Email assertion:', () => {
  it('Gets the email on basis of a search query', function () {
    const mailOptions = {
      from: 'activate@edx.org',
      // to: HelperFunctions.getUniqueEmailAlias(),
      to: 'kch786+1124@gmail.com',
      subject: 'Activate',
    }
    cy.task('mailReader', mailOptions).then((email) => {
      cy.log(HelperFunctions.extractUrlFromEmail(email, 'activate'))
    })
  })
})
