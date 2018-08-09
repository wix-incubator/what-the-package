const { resolveVersion } = require("./utils")
const npm = require("./npmService")

const getRegistryInfoField = fieldName => async (npmModuleName, date) => {
  const packageReleases = await npm.getPackageReleases(npmModuleName)
  const version = resolveVersion(packageReleases, date, "x")

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
  getDevDependencySemvers
}
