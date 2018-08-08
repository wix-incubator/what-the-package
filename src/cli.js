#!/usr/bin/env node
/* eslint no-console: 0 */
const _ = require("lodash")
const dayjs = require("dayjs")
const SV = require("semver")
const createDependencyComparator = require("../src/createDependencyComparator")
const dataApi = require("../src/npmPackageResolver")
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

  _.after('fd', 'fd')

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
    "$0 <npmModuleName> <prior> <latter>",
    "compare dependency versions between time points",
    yargs => {
      yargs.positional("npmModuleName", {
        describe: "name of an npm module",
        type: "string"
      })

      yargs.positional("prior", {
        describe: "time of comparison start",
        type: "string"
      })

      yargs.positional("latter", {
        describe: "time of comparison end",
        type: "string"
      })
    },
    argv => {
      const { npmModuleName } = argv
      const prior = dayjs(argv.prior)
      const latter = dayjs(argv.latter)

      if (argv.raw) {
        compareNpmModuleDependencies(
          npmModuleName,
          prior.valueOf(),
          latter.valueOf()
        )
          .then(res => console.log(res))
          .catch(err => console.error(err))
      } else {
        console.log("=== Comparing Dependencies ===")
        console.log(` * name: ${npmModuleName}`)
        console.log(` * prior: ${prior}`)
        console.log(` * latter: ${latter}`)
        console.log("")

        compareNpmModuleDependencies(
          npmModuleName,
          prior.valueOf(),
          latter.valueOf()
        )
          .then(res => {
            printSummary(res)
          })
          .catch(err => console.error("Something went wrong:\n", err))
      }
    }
  )
  .options({
    raw: {
      alias: "r",
      describe: "generate raw output"
    }
  })
  .help().argv
