// @flow
const _ = require("lodash")
const {getExactDependencyVersionsAt} = require("./utils")

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





module.exports = {
  findNpmModuleDependenciesDiff,
}
