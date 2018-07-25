// @flow
const _ = require("lodash")
const {
  getExactDependencyVersionsAt,
  getVersionsComparison
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

const compareNpmModuleDependencies = (
  npmModuleName /*: NpmModuleName */,
  priorTimestamp /*: TimestampMs */,
  latterTimestamp /*: TimestampMs */
) /*: null | { [NpmModuleName]: VersionDiff } */ => {
  if (priorTimestamp >= latterTimestamp) {
    throw new Error(`${priorTimestamp} is not prior to ${latterTimestamp}`)
  }
  const priorDependencies = getExactDependencyVersionsAt(
    npmModuleName,
    priorTimestamp
  )
  const latterDependencies = getExactDependencyVersionsAt(
    npmModuleName,
    latterTimestamp
  )

  if (priorDependencies === null || latterDependencies === null) {
    return null
  }

  const result = getVersionsComparison(priorDependencies, latterDependencies)
  return result
}

module.exports = {
  compareNpmModuleDependencies
}
