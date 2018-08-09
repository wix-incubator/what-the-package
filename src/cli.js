#!/usr/bin/env node
/* eslint no-console: 0 */
const createDependencyComparator = require("../src/createDependencyComparator")
const ui = require("./cli/ui")
const dayjs = require("dayjs")
const npmService = require("./npmService")
const fs = require("fs")
const path = require("path")

const SOURCE_TYPES = {
  GIT: "git",
  NPM: "npm"
}

const sourceToResolver = {
  [SOURCE_TYPES.NPM]: require("../src/npmPackageResolver"),
  [SOURCE_TYPES.GIT]: require("../src/gitPackageResolver")
}

const getSourceType = async source => {
  if (fs.existsSync(source)) {
    return SOURCE_TYPES.GIT
  } else {
    await npmService.view({
      moduleName: source,
      fieldName: 'name'
    })

    return SOURCE_TYPES.NPM
  }
}

require("yargs")
  .usage(
    "$0 [options]",
    "compare dependency versions between time points",
    async argv => {
      let resolvingSourceSpinner
      const { priorDate, source, raw, latterDate, noColor } = argv.argv

      try {
        resolvingSourceSpinner = ui.spinner.start("Resolving source...")

        const sourceType = await getSourceType(source)

        ui.spinner.success(
          resolvingSourceSpinner,
          "Resolving dependency is completed:"
        )

        const { compareNpmModuleDependencies } = createDependencyComparator(
          sourceToResolver[sourceType]
        )

        if (raw) {
          compareNpmModuleDependencies(
            source,
            priorDate.valueOf(),
            latterDate.valueOf()
          )
            .then(res => console.log(res))
            .catch(err => console.error(err))
        } else {
          ui.printHeader({
            source:
              sourceType === SOURCE_TYPES.GIT ? path.resolve(source) : source,
            priorDate,
            latterDate
          })

          const comparingDependenciesSpinner = ui.spinner.start(
            "Comparing dependencies..."
          )

          compareNpmModuleDependencies(
            source,
            dayjs(priorDate),
            dayjs(latterDate)
          )
            .then(res => {
              ui.spinner.success(
                comparingDependenciesSpinner,
                "Comparing dependencies is completed:"
              )
              ui.printSummary(res, noColor)
            })
            .catch(error => {
              ui.spinner.fail(
                comparingDependenciesSpinner,
                "😢 Something went wrong:"
              )
              console.error(error)
            })
        }
      } catch (error) {
        ui.spinner.fail(
          resolvingSourceSpinner,
          "😢 Such directory or npm package did not find:"
        )
        // console.error(error)
      }
    }
  )
  .options({
    source: {
      alias: "s",
      describe:
        "Specify source project — local path to git repository or npm package name",
      string: true,
      default: process.cwd()
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
    ["prior-date"],
    "Please provide prior-date to work with this tool"
  )
  .help().argv
