// @flow
const _ = require("lodash")
const { execSync } = require('child_process') 
const fs = require("fs")
const dayjs = require("dayjs")
const SV = require("semver")

/*::
export type InfoField = "dependencies" | "devDependencies" | "time"
export type DateString = string
export type NpmModuleName = string
export type TimestampMs = number
export type Semver = string
export type Version = string
export type VersionDiff = {
  priorVersion : Version,
  latterVersion : Version
}
*/

const getRegistryInfoField = (
  npmModuleName /*: NpmModuleName */,
  fieldName /*: InfoField */
) /*: {[Version]: DateString} | null */=> {
  const cmd = `npm view --json ${npmModuleName} ${fieldName}`
  try {
    const fieldStr = execSync(cmd, {encoding: "utf8"})
    const field = JSON.parse(fieldStr)
    return field
  } catch (e) {
    return null
  }
}

const getExactVersion = (
  npmModuleName /*: NpmModuleName */,
  timestamp /*: TimestampMs */, 
  semver /*: Semver */
) /*: Version | null */ => {

  const versionToReleaseTime = getRegistryInfoField(
    npmModuleName,
    "time"
  )

  if (versionToReleaseTime === null) {
    return null
  }

  const versions = Object.keys(versionToReleaseTime)
  const filteredBySemver = versions.filter(version => {
    const semverRegex = /^\d+\.\d+\.\d+$/
    const isTagless = v => semverRegex.test(v)
    return isTagless(version) && SV.satisfies(version, semver)
  })
  const filteredByReleaseDate = filteredBySemver.filter(ver => dayjs(versionToReleaseTime[ver]).isBefore(dayjs(timestamp)))
  
  if (_.isEmpty(filteredByReleaseDate)) {
    return null
  } else {
    const latestVersion = _.maxBy(filteredByReleaseDate, ver => dayjs(versionToReleaseTime[ver]).valueOf())
    return latestVersion
  }
}

const getExactDependencyVersionsAt = (
  npmModuleName /*: NpmModuleName */,
  timestamp /*: TimestampMs */,
) /*: { [NpmModuleName]: Version | null } */ => {

  const version = getExactVersion(npmModuleName, timestamp, 'x')
  if (version === null) {
    return null
  }

  const dependencySemvers = getRegistryInfoField(`${npmModuleName}@${version}`, 'dependencies')
  console.log({npmModuleWithVersion: `${npmModuleName}@${version}`, dependencySemvers})
  const devDependencySemvers = getRegistryInfoField(`${npmModuleName}@${version}`, 'devDependencies')

  const allDependencySemvers = {
    ...dependencySemvers,
    ...devDependencySemvers,
  }

  const exactDependencyVersions = _.mapValues(allDependencySemvers, (semver, npmModuleName) => getExactVersion(npmModuleName, timestamp, semver))

  return exactDependencyVersions
}

module.exports = {
  getRegistryInfoField,
  getExactVersion,
  getExactDependencyVersionsAt,
}