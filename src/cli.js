#!/usr/bin/env node
/* eslint no-console: 0 */
const createDependencyComparator = require("../src/createDependencyComparator")
const dataApi = require("../src/npmPackageResolver")
const { compareNpmModuleDependencies } = createDependencyComparator(dataApi)
const ui = require("./cli/ui")

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
        ui.printHeader({ source, priorDate, latterDate })

        const spinner = ui.spinner.start()

        compareNpmModuleDependencies(
          source,
          priorDate.valueOf(),
          latterDate.valueOf()
        )
          .then(res => {
            ui.spinner.stop(spinner)
            ui.printSummary(res, noColor)
          })
          .catch(err => {
            ui.spinner.stop(spinner)
            console.error("Something went wrong:\n", err)
          })
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
