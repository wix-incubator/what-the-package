const _ = require("lodash")

const {resolveVersion} = require("./utils")
const npm = require('./npm-service')

getRegistryInfoField = fieldName => async (npmModuleName, timestamp) => {
  const packageReleases = await npm.getPackageReleases(npmModuleName)
  const version = resolveVersion(packageReleases, timestamp, "x")

  console.log('Npm.view=', npm.view);

  const {stderr, stdout} = await npm.view({
    moduleName: npmModuleName,
    version,
    fieldName
  })

  if (!_.isEmpty(stderr)) {
    return JSON.parse(stderr)
  } else {
    return _.isEmpty(stdout) ? {} : JSON.parse(stdout)
  }
}

const getDependencySemvers = getRegistryInfoField("dependencies")
const getDevDependencySemvers = getRegistryInfoField("devDependencies")

module.exports = {
  getDependencySemvers,
  getDevDependencySemvers,
}
