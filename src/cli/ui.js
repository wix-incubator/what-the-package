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

  if (addedModules) {
    printAddedModules(addedModules, setColor)
  }

  if (changedModules) {
    console.log("")
    printChangedModules(changedModules, setColor)
  }

  if (removedModules) {
    console.log("")
    printRemovedModules(removedModules, setColor)
  }

  console.log("")
  console.log("Use the '--raw' flag to get a raw json")
}

const printHeader = ({ source, priorDate, latterDate }) => {
  const dateFormat = "mm:HH DD-MM-YYYY (ddd) Z"

  console.log(` * source: ${source}`)
  console.log(` * prior: ${priorDate.format(dateFormat)}`)
  console.log(` * latter: ${latterDate.format(dateFormat)}`)
  console.log("")
}

const startSpinner = message => {
  return ora(message).start()
}

const stopSpinnerSuccessfully = (spinner, message) => {
  spinner.succeed(message)
}

const stopSpinnerUnsuccessfully = (spinner, message) => {
  spinner.fail(message)
}

module.exports = {
  printSummary,
  printHeader,
  spinner: {
    start: startSpinner,
    success: stopSpinnerSuccessfully,
    fail: stopSpinnerUnsuccessfully
  }
}
