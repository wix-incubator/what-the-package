#!/usr/bin/env node
/* eslint no-console: 0 */
const _ = require("lodash")
const dayjs = require("dayjs")
const SV = require("semver")
const createDependencyComparator = require("../src/createDependencyComparator")
const dataApi = require("../src/data-api")
const { compareNpmModuleDependencies } = createDependencyComparator(dataApi)

const printSummary = versionComparison => {
  const { removed, added, present } = _.groupBy(versionComparison, v => {
    if (_.isNull(v.priorVersion)) {
      return "added"
    } else if (_.isNull(v.latterVersion)) {
      return "removed"
    } else {
      return "present"
    }
  })

  const { changed, unchanged } = _.groupBy(present, v => {
    if (v.priorVersion === v.latterVersion) {
      return "unchanged"
    } else {
      return "changed"
    }
  })

  const { major, minor, patch, other } = _.groupBy(changed, v => {
    const svp = SV.coerce(v.priorVersion)
    const svl = SV.coerce(v.latterVersion)

    if (svp.major !== svl.major) {
      return "major"
    } else if (svp.minor !== svl.minor) {
      return "minor"
    } else if (svp.patch !== svl.patch) {
      return "patch"
    } else {
      return "other"
    }
  })

  console.log("=== Summary ===")
  console.log("")
  console.log(`Total packages: ${_.size(versionComparison)}`)
  console.log("")

  console.log(`Packages added: ${_.size(added)}`)
  console.log(`Packages removed: ${_.size(removed)}`)
  console.log(`Packages remaining: ${_.size(present)}`)
  console.log("")

  console.log(`Packages changed: ${_.size(changed)}`)
  console.log(`Packages unchanged: ${_.size(unchanged)}`)
  console.log("")

  console.log(`Major changed: ${_.size(major)}`)
  console.log(`Minor changed: ${_.size(minor)}`)
  console.log(`Patch changed: ${_.size(patch)}`)
  console.log(`Other???: ${_.size(other)}`)
  console.log("")

  console.log("Use the '--raw' flag to get a raw json")
}

require("yargs")
  .usage(
    "$0 [options]",
    "compare dependency versions between time points",
    argv => {
      const { priorDate, source, raw, latterDate } = argv.argv

      if (raw) {
        compareNpmModuleDependencies(
          source,
          priorDate.valueOf(),
          latterDate.valueOf()
        )
          .then(res => console.log(res))
          .catch(err => console.error(err))
      } else {
        console.log("=== Comparing Dependencies ===")
        console.log(` * source: ${source}`)
        console.log(` * prior: ${priorDate}`)
        console.log(` * latter: ${latterDate}`)
        console.log("")

        compareNpmModuleDependencies(
          source,
          priorDate.valueOf(),
          latterDate.valueOf()
        )
          .then(res => {
            printSummary(res)
          })
          .catch(err => console.error("Something went wrong:\n", err))
      }
    }
  )
  .options({
    source: {
      alias: "s",
      describe:
        "Specify source project — local path to git repository or npm package name",
      demandOption: true,
      string: true
    },
    "prior-date": {
      alias: "p",
      describe: "Date of comparison start, usually when build was green",
      demandOption: true,
      string: true
    },
    "latter-date": {
      alias: "l",
      describe: "Date of comparison end, usually when the build is broken",
      string: true,
      default: new Date()
    },
    raw: {
      alias: "r",
      describe: "Generate raw JSON output"
    }
  })
  .demandOption(
    ["source", "prior-date"],
    "Please provide both source and path prior-date to work with this tool"
  )
  .help().argv
