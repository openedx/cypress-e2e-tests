import EnterpriseCoupons from '../helpers/enterprise_coupons'

class HelperFunctions {
  // a method to verify links and text for some elements
  verifyLinksAndText(elems, expectedDict) {
    const names = [...elems].map(el => el.textContent.trim())
    const urls = [...elems].map(el => el.getAttribute('href'))
    const actualDict = Object.assign({}, ...names.map((n, index) => ({ [n]: urls[index] })))
    expect(actualDict).to.deep.equal(expectedDict)
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
