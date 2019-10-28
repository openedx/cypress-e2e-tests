import {HelperFunctions} from '../helpers/helper_functions';

describe('Email assertion:', () => {
  // Just a template to show how email reading will work
  it.skip('Gets the email on basis of a search query', function () {
    const mailOptions = {
      from: 'activate@edx.org',
      to: HelperFunctions.getUniqueEmailAlias(),
      subject: 'Activate',
    }
    cy.task('mailReader', mailOptions).then((email: any) => {
      cy.log(HelperFunctions.extractUrlFromEmail(email, 'activate'))
    })
  })
})
