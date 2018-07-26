const _ = require("lodash")
const dayjs = require("dayjs")
const SV = require("semver")

const resolveVersion = (versionToReleaseTime, timestamp, semver) => {
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
}

const compareNameToVersionMaps = (priorVersions, latterVersions) => {
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

module.exports = {
  compareNameToVersionMaps,
  resolveVersion
}
