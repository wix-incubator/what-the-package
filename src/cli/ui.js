/* eslint no-console: 0 */
const _ = require("lodash")
const consoleService = require("./colorsService")
const {
  printAddedModules,
  printChangedModules,
  printRemovedModules
} = require("./dependecyViews")
const ora = require("ora")

const printSummary = (modulesComparisonList, isColorDisabled) => {
  const setColor = consoleService.getColorConfigurator(isColorDisabled)

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

  console.log("")
  console.log("=== Summary ===")
  console.log("")
  printAddedModules(addedModules, setColor)
  console.log("")
  printChangedModules(changedModules, setColor)
  console.log("")
  printRemovedModules(removedModules, setColor)
  console.log("")
  console.log("")
  console.log("Use the '--raw' flag to get a raw json")
}

const printHeader = parameters => {
  console.log("")
  console.log(` * source: ${parameters.source}`)
  console.log(` * prior: ${parameters.priorDate}`)
  console.log(` * latter: ${parameters.latterDate}`)
  console.log("")
}

const startSpinner = () => {
  return ora("Comparing dependencies...").start()
}

const stopSpinner = spinner => {
  spinner.succeed("Comparing dependencies is completed")
}

module.exports = {
  printSummary,
  printHeader,
  spinner: {
    start: startSpinner,
    stop: stopSpinner
  }
}
