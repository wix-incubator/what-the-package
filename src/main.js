// @flow
const _ = require("lodash")
const { execSync } = require("child_process")
const dayjs = require("dayjs")
const SV = require("semver")
const {
  getDependencySemvers,
  getDevDependencySemvers,
  getReleaseTimes
} = require("./data-api")

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
  return getReleaseTimes(npmModuleName).then(versionToReleaseTime => {
    const versions = Object.keys(versionToReleaseTime)

    const filteredBySemver = versions.filter(version => {
      const semverRegex = /^\d+\.\d+\.\d+$/
      const isTagless = v => semverRegex.test(v)
      return isTagless(version) && SV.satisfies(version, semver)
    })

    const filteredByReleaseDate = filteredBySemver.filter(ver =>
      dayjs(versionToReleaseTime[ver]).isBefore(dayjs(timestamp))
    )

    if (_.isEmpty(filteredByReleaseDate)) {
      return null
    } else {
      const latestVersion = _.maxBy(filteredByReleaseDate, ver =>
        dayjs(versionToReleaseTime[ver]).valueOf()
      )

      return latestVersion
    }
  })
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

const getVersionsComparison = (
  priorVersions /*: { [NpmModuleName]: Version }  */,
  latterVersions /*: { [NpmModuleName]: Version }  */
) /*: { [NpmModuleName]: VersionDiff } */ => {
  const priorKeys = Object.keys(priorVersions)
  const latterKeys = Object.keys(latterVersions)
  const keys = _.union(priorKeys, latterKeys)
  const pairs = keys.map(moduleName => {
    return [
      moduleName,
      {
        priorVersion: priorVersions[moduleName] || null,
        latterVersion: latterVersions[moduleName] || null
      }
    ]
  })

  return _.fromPairs(pairs)
}

const getVersionsDiff = (priorVersions, latterVersions) => {
  const versionsComparison = getVersionsComparison(
    priorVersions,
    latterVersions
  )
  const diff = _.omitBy(versionsComparison, (versionsDiff, packageName) => {
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
    return getVersionsComparison(priorDependencies, latterDependencies)
  })
}

module.exports = {
  compareNpmModuleDependencies,
  getExactDependencyVersionsAt,
  getExactVersion,
  getVersionsComparison,
  getVersionsDiff
}
