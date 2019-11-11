require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
})

require('@babel/core').transform('file', {
  presets: ['@babel/preset-typescript'],
})

const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor')
const fs = require('fs-extra')
const path = require('path')
const gmail = require('./gmail_reader.ts').GmailReader


function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('.', 'config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

module.exports = (on, config) => {
  on('file:preprocessor', cypressTypeScriptPreprocessor)

  on('task', {
    failed: require('cypress-failed-log/src/failed')(),
    mailReader: gmail.readEmail,
  })
  const file = config.env.configFile

  return getConfigurationByFile(file)
}
