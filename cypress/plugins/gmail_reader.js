const { google } = require('googleapis')

/**
 * Create an OAuth2 client with the given credenials
 */
async function authorize() {
  const oAuth2Client = new google.auth.OAuth2({
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
  })
  oAuth2Client.setCredentials({
    access_token: process.env.GMAIL_ACCESS_TOKEM,
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  })
  return oAuth2Client
}

/**
 * Create the query string based on selected options
 * @param {String} from The sender of email
 * @param {String} to The Receiver of email
 * @param {String} subject Partial or full subject of email
 */
async function createSearchQuery(from, to, subject) {
  const queryString = `from:${from} to:${to} subject:${subject}`
  return queryString
}

/**
 * Get the latest message on the basis of a search criteria
 *
 * @param {google.gmail} gamil An authorized gmail client.
 * @param {String} gmailID Gmail Id for the target inbox
 * @param {String} searchQuery Search Query to find a specific email
 */
async function getMessageId(gmail, searchQuery, searchInterval = 2000, tryLimit = 15) {
  try {
    const messages = await new Promise((resolve, reject) => {
      // Use set interval function to check inbox repeatedly for a set time
      let counter = 1
      const timerId = setInterval(() => {
        gmail.users.messages.list({
          userId: 'me',
          q: searchQuery,
        }, async function (err, res) {
          counter += 1
          if (err) {
            reject(err)
          } else
          if (res.data.messages !== undefined) {
            clearInterval(timerId)
            const [targetMessage] = res.data.messages
            resolve(targetMessage.id)
          } else
          if (counter === tryLimit) {
            clearInterval(timerId)
            const customizedError = new Error('No Message found that matches the search criteria')
            reject(customizedError)
          }
        })
      }, searchInterval)
    })
    return messages
  } catch (err) {
    const customError = new Error(`List Messages api failed with following error: ${err}`)
    throw customError
  }
}

/**
 * Get the message body using message id
 *
 * @param {google.gmail} gmail An authorized gmail client.
 * @param {String} msgId Message Id against which the text needs to be returned
 */
async function getMessage(gmail, msgId) {
  try {
    const message = await new Promise((resolve, reject) => {
      gmail.users.messages.get({
        userId: 'me',
        id: msgId,
        format: 'full',
      }, async function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res.data)
        }
      })
    })
    return message
  } catch (err) {
    const customError = new Error(`Get Message api failed with following error: ${err}`)
    throw customError
  }
}

/**
 * Decode the message body
 *
 * @param {String} message Message that needs to be decoded
 */
async function decodeMessage(message) {
  let emaiBody
  const { body } = message.payload
  if (body.size) {
    emaiBody = Buffer.from(message.payload.body.data, 'base64').toString('utf8')
  } else {
    const bodyPart = message.payload.parts.find(p => p.mimeType === 'text/plain')
    if (bodyPart) {
      emaiBody = Buffer.from(bodyPart.body.data, 'base64').toString('utf8')
    }
  }
  return emaiBody
}

/**
 * Read Email
 *
 * @param {Array} options Disctionary of options
 */
async function readEmail(options = {}) {
  const auth = await authorize()
  const gmail = google.gmail({ auth, version: 'v1' })
  const queryString = await createSearchQuery(options.from, options.to, options.subject)
  const msgId = await getMessageId(gmail, queryString, options.searchInterval, options.tryLimit)
  const message = await getMessage(gmail, msgId)
  const readableMessage = await decodeMessage(message)
  return readableMessage
}

module.exports = { readEmail }
