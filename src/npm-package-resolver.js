const _ = require("lodash")

const {resolveVersion} = require("./utils")
const npm = require('./npm-service')

getRegistryInfoField = fieldName => async (npmModuleName, timestamp) => {
  const packageReleases = await npm.getPackageReleases(npmModuleName)
  const version = resolveVersion(packageReleases, timestamp, "x")

  const dependencies = await npm.view({
    moduleName: npmModuleName,
    version,
    fieldName
  })

  return dependencies || {}
}

const getDependencySemvers = getRegistryInfoField("dependencies")
const getDevDependencySemvers = getRegistryInfoField("devDependencies")

module.exports = {
  getDependencySemvers,
  getDevDependencySemvers,
}
