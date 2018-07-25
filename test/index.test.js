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



const { compareNpmModuleDependencies } = require("../src")

describe("compareNpmModuleDependencies", () => {
  test("should calculate dependecy diff for detox module", () => {
    const npmModuleName = DETOX_NAME
    const priorTimestamp = (new Date(DETOX_TIME["7.0.0"])).valueOf() + 1
    const latterTimestamp = (new Date(DETOX_TIME["8.0.0"])).valueOf() + 1

    const result = compareNpmModuleDependencies(
      npmModuleName,
      priorTimestamp,
      latterTimestamp
    )

    expect(result).toEqual(false)
  })

  test("should throw if latter is before prior", () => {
    const npmModuleName = DETOX_NAME
    const invalidPriorTimestamp = (new Date(DETOX_TIME["8.0.0"])).valueOf()
    const invalidLatterTimestamp = (new Date(DETOX_TIME["2.0.0"])).valueOf()

    expect(() => compareNpmModuleDependencies(
      npmModuleName,
      invalidPriorTimestamp,
      invalidLatterTimestamp
    )).toThrow()
  })

  test("should return null if something went wrong", () => {
    const npmModuleName = "a-non-existent-package---what-are-the-odds-there-will-be"
    const priorTimestamp = (new Date(DETOX_TIME["7.0.0"])).valueOf()
    const latterTimestamp = (new Date(DETOX_TIME["8.0.0"])).valueOf()

    const result = compareNpmModuleDependencies(
      npmModuleName,
        priorTimestamp,
      latterTimestamp
    )

    expect(result).toBeNull()
  })

})

