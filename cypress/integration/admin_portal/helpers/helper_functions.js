class HelperFunctions {
  // a method to verify links and text for some elements
  verifyLinksAndText(elems, expectedDict) {
    const names = [...elems].map(el => el.textContent.trim())
    const urls = [...elems].map(el => el.getAttribute('href'))
    const actualDict = Object.assign({}, ...names.map((n, index) => ({ [n]: urls[index] })))
    expect(actualDict).to.deep.equal(expectedDict)
  }
}

export default HelperFunctions
