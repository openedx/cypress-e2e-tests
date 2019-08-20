const uuidv4 = require('uuid/v4')

class HelperFunctions {
  // a method to verify links and text for some elements
  verifyLinksAndText(elems, expectedDict) {
    const names = [...elems].map(el => el.textContent.trim())
    const urls = [...elems].map(el => el.getAttribute('href'))
    const actualDict = Object.assign({}, ...names.map((n, index) => ({ [n]: urls[index] })))
    expect(actualDict).to.deep.equal(expectedDict)
  }

  getUniqueEmailAddress() {
    const randomString = uuidv4().substr(-11)
    const emailAddress = Cypress.env('GMAIL_ID')
    const position = emailAddress.indexOf('@')
    return `${emailAddress.slice(0, position)}+${randomString}${emailAddress.slice(position)}`
  }
}

export default HelperFunctions
