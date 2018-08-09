/* eslint no-console: 0 */

const SV = require("semver")
const table = require("text-table")
const _ = require("lodash")
const colorsService = require("./colorsService")

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

const printAddedModules = (modules, setColor) => {
  modules ? console.log("Added") : null
  console.log(
    table(
      _.map(modules, module => {
        return [
          setColor(colorsService.colors.green),
          module.packageName,
          setColor(colorsService.colors.RESET)
        ]
      })
    )
  )
  console.log("")
}

const printChangedModules = (modules, setColor) => {
  modules ? console.log("Changed") : null
  console.log(
    table(
      _.orderBy(
        _.map(modules, module => {
          return [
            setColor(colorsService.colors.yellow),
            module.packageName,
            module.priorVersion,
            setColor(colorsService.colors.RESET),
            "→",
            setColor(colorsService.colors.yellow),
            module.latterVersion,
            setColor(colorsService.colors.RESET),
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
}

const printRemovedModules = (modules, setColor) => {
  modules ? console.log("Removed") : null
  console.log(
    table(
      _.map(modules, module => {
        return [
          setColor(colorsService.colors.red),
          module.packageName,
          setColor(colorsService.colors.RESET)
        ]
      })
    )
  )
  console.log("")
}

module.exports = {
  printAddedModules,
  printChangedModules,
  printRemovedModules
}
