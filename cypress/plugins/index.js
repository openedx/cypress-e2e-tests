/* eslint-disable */
const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor')

module.exports = on => {
  on('file:preprocessor', cypressTypeScriptPreprocessor)
}

const fs = require('fs-extra')
const path = require('path')
const gmail = require("./gmail_reader")

function getConfigurationByFile (file) {
  const pathToConfigFile = path.resolve('.', 'config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

module.exports = (on) => {

  on('task', {
    failed: require('cypress-failed-log/src/failed')(),
    mailReader: gmail.readEmail
  })
  const file = config.env.configFile

  return getConfigurationByFile(file)

}
