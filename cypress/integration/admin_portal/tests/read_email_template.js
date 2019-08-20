import HelperFunctions from '../helpers/helper_functions'

describe('Email assertion:', () => {
  const helpers = new HelperFunctions()
  it('Gets the email on basis of a search query', function () {
    const mailOptions = {
      from: 'activate@edx.org',
      to: helpers.getUniqueEmailAlias(),
      subject: 'Activate',
    }
    cy.task('mailReader', mailOptions).then((email) => {
      cy.log(helpers.extractUrlFromEmail(email, 'activate'))
    })
  })
})
