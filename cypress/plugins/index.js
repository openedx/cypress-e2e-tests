/* eslint-disable */

const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile (file) {
  const pathToConfigFile = path.resolve('.', 'config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
module.exports = (on, config) => {
  const file = config.env.ENVIRONMENT || 'authenticationMFEStage'

  return getConfigurationByFile(file)

}
