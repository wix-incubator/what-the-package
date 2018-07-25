const _ = require("lodash")
const path = require("path")
const detoxRegistryInfo = require("../data/npm-view-detox-8.json")

const {
  dependencies: DETOX_DEPENDENCIES,
  devDependencies: DETOX_DEV_DEPENDENCIES,
  name: DETOX_NAME,
  time: DETOX_TIME,
  version: DETOX_VERSION
} = detoxRegistryInfo



const { findNpmModuleDependenciesDiff } = require("../src")

describe("findNpmModuleDependenciesDiff", () => {
  test("should calculate dependecy diff for detox module", () => {
    const npmModuleName = DETOX_NAME
    const priorTimestamp = (new Date(DETOX_TIME["7.0.0"])).valueOf() + 1
    const latterTimestamp = (new Date(DETOX_TIME["8.0.0"])).valueOf() + 1

    const depDiff = findNpmModuleDependenciesDiff(
      npmModuleName,
      priorTimestamp,
      latterTimestamp
    )

    expect(depDiff).toEqual(false)
  })
})

