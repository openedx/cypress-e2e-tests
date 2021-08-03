const uuidv4 = require('uuid/v4')

class HelperFunctions {
  /**
  * Helper method to make a dictionary of URls and their labels inside an element
  *
  * @param {Object} elems Elements which contains links
  */
  static getLabelAndUrlsDict(elems) {
    const names = [...elems].map(el => el.textContent.trim())
    const urls = [...elems].map(el => el.getAttribute('href'))
    return Object.assign({}, ...names.map((n, index) => ({ [n]: urls[index] })))
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

  /**
  * Helper method to extract access code from email text
  *
  * @param {String} emailText Email body from which code needs to be searched
  */
  static extractAccessCodeFromEmail(emailText) {
    const codeRegex = new RegExp(String.raw`(?<=Access Code: )\w+`)
    const code = emailText.match(codeRegex)
    return code[0]
  }
  
  /**
  * Helper method to parse report data from response
  *
  * @param {String} responseBody body from which data needs to be split
  */
  static parseReportData(responseBody) {
    const splitDataArr = responseBody.split(/[\n]/)
    const reportData = splitDataArr[1]
    const dataArr = reportData.split(',')
    const mapReportData = {
      assigned_to: dataArr[0],
      code: dataArr[1],
      redeem_url: dataArr[2],
    }
    return mapReportData
  }

  /**
  * Helper method to convert date to Short From
  *
  * @param {Date} originalDate Date which needs to be converted into short form
  */
  static convertDateToShortFormat(originalDate) {
    const date = new Date(originalDate)
    return Intl.DateTimeFormat('en-US').format(date)
  }

  /**
  * Helper method to get coupon data from coupon report
  *
  * @param {String} couponReport Coupon Report from whihc we need specific data
  */
  static readCouponData(couponReport) {
    const data = {
      couponName: couponReport.match(/Test_Coupon_\w+/g),
      dates: couponReport.match(/\w+ \d+, \d+/g),
    }
    return data
  }
}
export default HelperFunctions
