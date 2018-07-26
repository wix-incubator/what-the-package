const _ = require("lodash")
const util = require("util")
const { execSync } = require("child_process")
const exec = util.promisify(require("child_process").exec)
const dayjs = require("dayjs")
const SV = require("semver")

const getRegistryInfoField = async (npmModuleName, fieldName) => {
  const cmd = `npm view --json ${npmModuleName} ${fieldName}`
  const { stdout, stderr } = await exec(cmd, { encoding: "utf8" })

  return _.isEmpty(stderr)
    ? _.isEmpty(stdout)
      ? {}
      : JSON.parse(stdout)
    : JSON.parse(stderr)
}

const getDependencySemvers = npmModuleName =>
  getRegistryInfoField(npmModuleName, "dependencies")
const getDevDependencySemvers = npmModuleName =>
  getRegistryInfoField(npmModuleName, "devDependencies")
const getReleaseTimes = npmModuleName =>
  getRegistryInfoField(npmModuleName, "time")

module.exports = {
  getDependencySemvers,
  getDevDependencySemvers,
  getReleaseTimes
}
