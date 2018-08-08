const _ = require("lodash")
const { compareNameToVersionMaps, resolveVersion } = require("./utils")
const npm = require('./npm-service')

const createDependencyComparator = dataApi => {
  const {
    getDependencySemvers,
    getDevDependencySemvers,
  } = dataApi

  const getExactVersion = (
    npmModuleName /*: NpmModuleName */,
    timestamp /*: TimestampMs */,
    semver /*: Semver */
  ) /*: Version | null */ => {
    return npm.getPackageReleases(npmModuleName).then(versionToReleaseTime =>
      resolveVersion(versionToReleaseTime, timestamp, semver)
    )
  }

  const getExactDependencyVersionsAt = async (
    npmModuleName /*: NpmModuleName */,
    timestamp /*: TimestampMs */
  ) /*: { [NpmModuleName]: Version } | null */ => {
    return Promise.all([
      getDependencySemvers(npmModuleName, timestamp),
      getDevDependencySemvers(npmModuleName, timestamp)
    ])
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

  const compareGitDependencies = async (
    gitDir,
    priorTimestamp,
    latterTimestamp
  ) => {
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

  return {
    compareNpmModuleDependencies,
    getExactDependencyVersionsAt,
    compareGitDependencies,
    getExactVersion
  }
}

module.exports = createDependencyComparator
