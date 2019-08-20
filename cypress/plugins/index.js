/* eslint-disable */

const fs = require('fs-extra')
const path = require('path')
const gmail = require("./gmail_reader")

function getConfigurationByFile (file) {
  const pathToConfigFile = path.resolve('.', 'config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
module.exports = (on, config) => {

  on('task', {
    failed: require('cypress-failed-log/src/failed')(),
    mailReader: gmail.readEmail
  })
  const file = config.env.configFile || 'journals_mit_stage'

  return getConfigurationByFile(file)

}
