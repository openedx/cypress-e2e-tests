import uuidv4 = require('uuid/v4');

export class HelperFunctions {
  /**
  * Helper method to make a dictionary of URls and their labels inside an element
  *
  */
  static getLabelAndUrlsDict(elems: any) {
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
  */
  static extractUrlFromEmail(emailText: { match: (arg0: RegExp) => void; }, subString: string) {
    const urlRegex = new RegExp(String.raw`(https?:\/\/[^\s]+${subString}?[^\s]+)`)
    const urls:any = emailText.match(urlRegex)
    return urls[0]
  }

  /**
  * Helper method to extract access code from email text
  *
  */
  static extractAccessCodeFromEmail(emailText: { match: (arg0: RegExp) => void; }) {
    const codeRegex = new RegExp(String.raw`(?<=Access Code: )\w+`)
    const code: any = emailText.match(codeRegex)
    return code[0]
  }

  /**
  * Helper method to parse report data from response
  *
  */
  static parseReportData(responseBody: { split: (arg0: RegExp) => void; }) {
    const splitDataArr: any = responseBody.split(/[\n]/)
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
  */
  static convertDateToShortFormat(originalDate: string | number | Date) {
    const date = new Date(originalDate)
    return Intl.DateTimeFormat('en-US').format(date)
  }

  /**
  * Helper method to get coupon data from coupon report
  */
  static readCouponData(couponReport: { match: { (arg0: RegExp): void; (arg0: RegExp): void; }; }) {
    const data = {
      couponName: couponReport.match(/Test_Coupon_\w+/g),
      dates: couponReport.match(/\w+ \d+, \d+/g),
    }
    return data
  }
}

