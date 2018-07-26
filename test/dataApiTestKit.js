const _ = require("lodash")
const util = require("util")
const { execSync } = require("child_process")
const exec = util.promisify(require("child_process").exec)
const dayjs = require("dayjs")
const SV = require("semver")

const getRegistryInfoField = fieldName => async (npmModuleName, version) => {
  const cmd = `npm view --json ${npmModuleName}@${version} ${fieldName}`
  const { stdout, stderr } = await exec(cmd, { encoding: "utf8" })

  return _.isEmpty(stderr)
    ? _.isEmpty(stdout)
      ? {}
      : JSON.parse(stdout)
    : JSON.parse(stderr)
}

const getDependencySemvers = getRegistryInfoField("dependencies")
const getDevDependencySemvers = getRegistryInfoField("devDependencies")
const getReleaseTimes = getRegistryInfoField("time")

module.exports = {
  getDependencySemvers,
  getDevDependencySemvers,
  getReleaseTimes
}
