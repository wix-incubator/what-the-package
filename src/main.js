// @flow
const _ = require("lodash")

const {
  getDependencySemvers,
  getDevDependencySemvers,
  getReleaseTimes
} = require("./data-api")
const { compareNameToVersionMaps, resolveVersion } = require("./utils")
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

const getExactVersion = (
  npmModuleName /*: NpmModuleName */,
  timestamp /*: TimestampMs */,
  semver /*: Semver */
) /*: Version | null */ => {
  return getReleaseTimes(npmModuleName).then(versionToReleaseTime =>
    resolveVersion(versionToReleaseTime, timestamp, semver)
  )
}

const getExactDependencyVersionsAt = async (
  npmModuleName /*: NpmModuleName */,
  timestamp /*: TimestampMs */
) /*: { [NpmModuleName]: Version } | null */ => {
  return getExactVersion(npmModuleName, timestamp, "x")
    .then(version => {
      return Promise.all([
        getDependencySemvers(`${npmModuleName}@${version}`),
        getDevDependencySemvers(`${npmModuleName}@${version}`)
      ])
    })
    .then(([dependencySemvers, devDependencySemvers]) => {
      return Object.assign({}, dependencySemvers, devDependencySemvers)
    })
    .then(async allDependencySemvers => {
      const depSemverPairs = _.toPairs(allDependencySemvers)

      const depVersionPairs = await Promise.all(
        depSemverPairs.map(([npmModuleName, semver]) =>
          Promise.all([
            npmModuleName,
            getExactVersion(npmModuleName, timestamp, semver)
          ])
        )
      )

      return _.fromPairs(depVersionPairs)
    })
}

const getVersionsDiff = (priorVersions, latterVersions) => {
  const versionsComparison = compareNameToVersionMaps(
    priorVersions,
    latterVersions
  )
  const diff = _.omitBy(versionsComparison, versionsDiff => {
    return versionsDiff.priorVersion === versionsDiff.latterVersion
  })
  return diff
}

const compareNpmModuleDependencies = async (
  npmModuleName /*: NpmModuleName */,
  priorTimestamp /*: TimestampMs */,
  latterTimestamp /*: TimestampMs */
) /*: null | { [NpmModuleName]: VersionDiff } */ => {
  if (priorTimestamp >= latterTimestamp) {
    throw new Error(`${priorTimestamp} is not prior to ${latterTimestamp}`)
  }

  return Promise.all([
    getExactDependencyVersionsAt(npmModuleName, priorTimestamp),
    getExactDependencyVersionsAt(npmModuleName, latterTimestamp)
  ]).then(([priorDependencies, latterDependencies]) => {
    return compareNameToVersionMaps(priorDependencies, latterDependencies)
  })
}

module.exports = {
  compareNpmModuleDependencies,
  getExactDependencyVersionsAt,
  getExactVersion,
  getVersionsDiff
}
