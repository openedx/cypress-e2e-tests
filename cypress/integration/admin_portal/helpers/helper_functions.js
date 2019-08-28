import EnterpriseCoupons from '../helpers/enterprise_coupons'

const uuidv4 = require('uuid/v4')

class HelperFunctions {
  /**
  * Helper method to verify links and text
  *
  * @param {Object} elems Elements which contains links
  * @param {Array} expectedDict Links and Text to be matched
  */
  static verifyLinksAndText(elems, expectedDict) {
    const names = [...elems].map(el => el.textContent.trim())
    const urls = [...elems].map(el => el.getAttribute('href'))
    const actualDict = Object.assign({}, ...names.map((n, index) => ({ [n]: urls[index] })))
    expect(actualDict).to.deep.equal(expectedDict)
  }

  /**
  * Helper method to create unique gmail alias
  */
  static getUniqueEmailAlias() {
    const randomString = uuidv4().substr(-11)
    const emailAddress = Cypress.env('GMAIL_ID')
    const position = emailAddress.indexOf('@')
    return `${emailAddress.slice(0, position)}+${randomString}${emailAddress.slice(position)}`
  }

  /**
  * Helper method to extract url from email text
  *
  * @param {String} emailText Email body from which url needs to be searched
  * @param {String} subString any substring which should ne present in the target url
  */
  static extractUrlFromEmail(emailText, subString) {
    const urlRegex = new RegExp(String.raw`(https?:\/\/[^\s]+${subString}?[^\s]+)`)
    const urls = emailText.match(urlRegex)
    return urls[0]
  }

  convertDateToShortFormat(value) {
    const date = new Date(value)
    return Intl.DateTimeFormat('en-US').format(date)
  }

  couponData(couponId) {
    const coupons = new EnterpriseCoupons()
    return coupons.fetchCouponReport(couponId).then((response) => {
    })
  }
}

export default HelperFunctions
