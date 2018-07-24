// @flow
const _ = require("lodash")
const { execSync } = require('child_process') 
const fs = require("fs")
const dayjs = require("dayjs")
const semver = require("semver")

const {
  getRegistryInfoField,
  semverToExactVersion,
  getExactDependencyVersionsAt,
} = require("./utils")

/*::
import type {
  InfoField, 
  NpmModuleName,
  TimestampMs,
  Semver,
  Version,
  VersionDiff
} from "./utils"
*/

const findNpmModuleDependenciesDiff = (
  npmModuleName /*: NpmModuleName */,
  priorTimestamp /*: TimestampMs */, 
  latterTimestamp /*: TimestampMs */
) /*: { [NpmModuleName]: VersionDiff } */ => {
  
  // name -> prior -> deps
  // name -> latter -> deps
  // diff deps

  return {}
}

const getReleaseTimes = (packageName /*: string*/) => {
  const semverRegex = /^\d+\.\d+\.\d+$/
  const cmd = `npm view --json ${packageName} time`
  const viewJson = execSync(cmd, {encoding: "utf8"})
  const view = JSON.parse(viewJson)
  const semverOnly = _.pickBy(view, (v, k /*: string */) => semverRegex.test(k))
  return semverOnly
}

// date -> semver -> releaseTimes -> version
const resolveDependencyVersion = (timestamp, semverRule, releaseTimes) => {
  const doesMatchSemverRule = version => semver.satisfies(version, semverRule)
  const isBeforeTimestamp = releaseTime => dayjs(releaseTime).isBefore(dayjs(timestamp))

  const validVersions = _(releaseTimes)
    .map((releaseTime, version) => ({ version, releaseTime }))
    .filter(({releaseTime, version}) => doesMatchSemverRule(version) && isBeforeTimestamp(releaseTime))
    .value()
  const latestValidVersion = _.maxBy(validVersions, ({releaseTime}) => dayjs(releaseTime).valueOf())

  return latestValidVersion && latestValidVersion.version
}

const getVersionsAtTimestamp = (deps, timestamp) => _.mapValues(deps, (semverRule, packageName) => {
  const packageReleaseTimes = getReleaseTimes(packageName)
  return resolveDependencyVersion(timestamp, semverRule, packageReleaseTimes)
})

module.exports = {
  getDepsFromPackageJson,
  getReleaseTimes,
  resolveDependencyVersion,
  getVersionsAtTimestamp,
}
