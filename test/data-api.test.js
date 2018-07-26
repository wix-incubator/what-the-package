const {
  getDependencySemvers,
  getDevDependencySemvers,
  getReleaseTimes
} = require("../src/data-api")

const detoxRegistryInfo = require("../data/npm-view-detox-8.json")

const {
  dependencies: DETOX_DEPENDENCIES,
  devDependencies: DETOX_DEV_DEPENDENCIES,
  name: DETOX_NAME,
  time: DETOX_TIME,
  version: DETOX_VERSION
} = detoxRegistryInfo

const NON_EXISTING_PACKAGE_NAME =
  "if_this_packages_exists_then_our_build_deserves_to_break_111111oneoneone"

describe("data-api", () => {
  test("getDependencySemvers should return correct dependencies", async () => {
    const moduleName = `${DETOX_NAME}@${DETOX_VERSION}`
    const fieldName = "dependencies"
    const actual = getDependencySemvers(moduleName, fieldName)

    return expect(actual).resolves.toEqual(DETOX_DEPENDENCIES)
  })

  test("getDevDependencySemvers should return correct devDependencies", () => {
    const moduleName = `${DETOX_NAME}@${DETOX_VERSION}`
    const fieldName = "devDependencies"
    const actual = getDevDependencySemvers(moduleName, fieldName)

    return expect(actual).resolves.toEqual(DETOX_DEV_DEPENDENCIES)
  })

  test("getReleaseTimes should return correct release times", () => {
    const moduleName = `${DETOX_NAME}@${DETOX_VERSION}`
    const fieldName = "time"
    const actual = getReleaseTimes(moduleName, fieldName)

    return expect(actual).resolves.toEqual(DETOX_TIME)
  })

  test("should return error message for non-existing package", async () => {
    const moduleName = NON_EXISTING_PACKAGE_NAME
    const fieldName = "time"
    const actual = getReleaseTimes(moduleName, fieldName)
    return expect(actual).rejects.toThrow()
  })
})
