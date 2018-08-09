const _ = require("lodash")
const { compareNameToVersionMaps, resolveVersion } = require("./utils")
const npm = require("./npmService")

const createDependencyComparator = packageResolver => {
  const { getDependencySemvers, getDevDependencySemvers } = packageResolver

  const getExactVersion = async (
    npmModuleName,
    date,
    semver
  ) /*: Version | null */ => {
    return npm
      .getPackageReleases(npmModuleName)
      .then(versionToReleaseTime =>
        resolveVersion(versionToReleaseTime, date, semver)
      )
  }

  const getExactDependencyVersionsAt = async (
    npmModuleName,
    date
  ) /*: { [NpmModuleName]: Version } | null */ => {
    return Promise.all([
      getDependencySemvers(npmModuleName, date),
      getDevDependencySemvers(npmModuleName, date)
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
              getExactVersion(npmModuleName, date, semver)
            ])
          )
        )

        return _.fromPairs(depVersionPairs)
      })
  }

  const compareNpmModuleDependencies = async (
    npmModuleName,
    priorDate,
    latterDate
  ) /*: null | { [NpmModuleName]: VersionDiff } */ => {
    if (priorDate.unix() >= latterDate.unix()) {
      throw new Error(
        `${priorDate.toString()} is not prior to ${latterDate.toString()}`
      )
    }

    return Promise.all([
      getExactDependencyVersionsAt(npmModuleName, priorDate),
      getExactDependencyVersionsAt(npmModuleName, latterDate)
    ]).then(([priorDependencies, latterDependencies]) => {
      return compareNameToVersionMaps(priorDependencies, latterDependencies)
    })
  }

  return {
    compareNpmModuleDependencies,
    getExactDependencyVersionsAt,
    getExactVersion
  }
}

module.exports = createDependencyComparator
