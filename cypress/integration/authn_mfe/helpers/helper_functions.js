const uuidv4 = require('uuid/v4')
class HelperFunctions {
    
    static extractActivationLinkFromEmail(emailText) {
        const codeRegex = new RegExp(String.raw`https:\/\/courses.stage.edx.org\/activate\/(\w+\S+)`)
        const code = emailText.match(codeRegex)
        return code[0]
    }

    static extractResetLinkFromEmail(emailText) {
        const codeRegex = new RegExp(String.raw`https:\/\/authn.stage.edx.org\/password_reset_confirm\/(\w+\S+)`)
        const code = emailText.match(codeRegex)
        return code[0]
    }

    static getUniqueEmailAlias(email) {
        const randomString = uuidv4().substr(-11)
        const emailAddress = email
        console.log(emailAddress)
        const position = emailAddress.indexOf('@')
        return `${emailAddress.slice(0, position)}+${randomString}${emailAddress.slice(position)}`
  }

}
export default HelperFunctions