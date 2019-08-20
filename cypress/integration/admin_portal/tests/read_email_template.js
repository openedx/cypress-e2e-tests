import HelperFunctions from '../helpers/helper_functions'

describe('Email assertion:', () => {
  const helpers = new HelperFunctions()
  it('Gets the email on basis of a search query', function () {
    cy.log(helpers.getUniqueEmailAddress())
    const mailOptions = {
      from: 'activate@edx.org',
      to: helpers.getUniqueEmailAddress(),
      subject: 'Activate',
    }
    cy.task('mailReader', mailOptions).then((email) => {
      cy.log(email)
    })
  })
})
