#!/usr/bin/env node
/* eslint no-console: 0 */
const { checkDependencies } = require("./main")

require("yargs")
  .usage(
    "$0 [options]",
    "compare dependency versions between time points",
    async argv => {
      checkDependencies(argv.argv)
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
