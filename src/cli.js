#!/usr/bin/env node
/* eslint no-console: 0 */
const _ = require("lodash")
const dayjs = require("dayjs")
const SV = require("semver")
const table = require("text-table")
const createDependencyComparator = require("../src/createDependencyComparator")
const dataApi = require("../src/data-api")
const { compareNpmModuleDependencies } = createDependencyComparator(dataApi)

const getConsoleColorConfigurator = isColorDisabled => color => {
  const consoleColors = {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    RESET: "\x1b[0m"
  }

  return !isColorDisabled ? consoleColors[color] : ""
}

const printSummary = (modulesComparisonList, isColorDisabled) => {
  const setConsoleColor = getConsoleColorConfigurator(isColorDisabled)

  const {
    added: addedModules,
    removed: removedModules,
    present: presentModules
  } = _.groupBy(modulesComparisonList, module => {
    if (_.isNull(module.priorVersion)) {
      return "added"
    } else if (_.isNull(module.latterVersion)) {
      return "removed"
    } else {
      return "present"
    }
  })

  const changedModules = _.filter(
    presentModules,
    module => module.priorVersion !== module.latterVersion
  )

  const getSemVerType = module => {
    const svp = SV.coerce(module.priorVersion)
    const svl = SV.coerce(module.latterVersion)

    if (svp.major !== svl.major) {
      return "major"
    } else if (svp.minor !== svl.minor) {
      return "minor"
    } else if (svp.patch !== svl.patch) {
      return "patch"
    } else {
      return "other"
    }
  }

  console.log("=== Summary ===")
  console.log("")
  addedModules ? console.log("Added") : null
  console.log(
    table(
      _.map(addedModules, module => {
        return [
          setConsoleColor("green"),
          module.packageName,
          setConsoleColor("RESET")
        ]
      })
    )
  )
  console.log("")
  changedModules ? console.log("Changed") : null
  console.log(
    table(
      _.orderBy(
        _.map(changedModules, module => {
          return [
            setConsoleColor("yellow"),
            module.packageName,
            module.priorVersion,
            setConsoleColor("RESET"),
            "→",
            setConsoleColor("yellow"),
            module.latterVersion,
            setConsoleColor("RESET"),
            getSemVerType(module)
          ]
        }),
        item => {
          return item[8]
        }
      )
    )
  )
  console.log("")
  removedModules ? console.log("Removed") : null
  console.log(
    table(
      _.map(removedModules, module => {
        return [
          setConsoleColor("red"),
          module.packageName,
          setConsoleColor("RESET")
        ]
      })
    )
  )
  console.log("")
  console.log("")
  console.log("Use the '--raw' flag to get a raw json")
}

require("yargs")
  .usage(
    "$0 [options]",
    "compare dependency versions between time points",
    argv => {
      const { priorDate, source, raw, latterDate, noColor } = argv.argv

      if (raw) {
        compareNpmModuleDependencies(
          source,
          priorDate.valueOf(),
          latterDate.valueOf()
        )
          .then(res => console.log(res))
          .catch(err => console.error(err))
      } else {
        console.log("")
        console.log(` * source: ${source}`)
        console.log(` * prior: ${priorDate}`)
        console.log(` * latter: ${latterDate}`)
        console.log("")
        console.log("=== Comparing Dependencies... ===")

        compareNpmModuleDependencies(
          source,
          priorDate.valueOf(),
          latterDate.valueOf()
        )
          .then(res => {
            printSummary(res, noColor)
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
    },
    "no-color": {
      alias: "n",
      describe: "Disable color output"
    }
  })
  .demandOption(
    ["source", "prior-date"],
    "Please provide both source and path prior-date to work with this tool"
  )
  .help().argv
