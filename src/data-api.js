const _ = require("lodash")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

const { resolveVersion } = require("./utils")

const getVersionToReleaseTime = async npmModuleName => {
  const cmd = `npm view --json ${npmModuleName} time`
  const { stderr, stdout } = await exec(cmd, { encoding: "utf8" })

  if (!_.isEmpty(stderr)) {
    return JSON.parse(stderr)
  } else {
    return _.isEmpty(stdout) ? {} : JSON.parse(stdout)
  }
}

const getRegistryInfoField = fieldName => async (npmModuleName, timestamp) => {
  const versionToReleaseTime = await getVersionToReleaseTime(npmModuleName)
  const version = resolveVersion(versionToReleaseTime, timestamp, "x")

  const cmd = `npm view --json ${npmModuleName}@${version} ${fieldName}`
  const { stderr, stdout } = await exec(cmd, { encoding: "utf8" })

  if (!_.isEmpty(stderr)) {
    return JSON.parse(stderr)
  } else {
    return _.isEmpty(stdout) ? {} : JSON.parse(stdout)
  }
}

const getDependencySemvers = getRegistryInfoField("dependencies")
const getDevDependencySemvers = getRegistryInfoField("devDependencies")
const getReleaseTimes = getVersionToReleaseTime

module.exports = {
  getDependencySemvers,
  getDevDependencySemvers,
  getReleaseTimes
}
