const {
  getRegistryInfoField,
  semverToExactVersion
} = require("../src/utils")

const NON_EXISTING_PACKAGE_NAME = "if_this_packages_exists_then_our_build_deserves_to_break_111111oneoneone"

const detoxRegistryInfo = require("../data/npm-view-detox-8.json")
const { 
  dependencies: DETOX_DEPENDENCIES, 
  devDependencies: DETOX_DEV_DEPENDENCIES, 
  name: DETOX_NAME,
  time: DETOX_TIME,
  version: DETOX_VERSION
} = detoxRegistryInfo

describe("getRegistryInfoField", () => {
  test("should return correct dependencies", () => {
    const moduleName = `${DETOX_NAME}@${DETOX_VERSION}`
    const fieldName = "dependencies"
    const actual = getRegistryInfoField(moduleName, fieldName)
    
    expect(actual).toEqual(DETOX_DEPENDENCIES)
  })

  test("should return correct devDependencies", () => {
    const moduleName = `${DETOX_NAME}@${DETOX_VERSION}`
    const fieldName = "devDependencies"
    const actual = getRegistryInfoField(moduleName, fieldName)
    
    expect(actual).toEqual(DETOX_DEV_DEPENDENCIES)
  })

  test("should return correct release times", () => {
    const moduleName = `${DETOX_NAME}@${DETOX_VERSION}`
    const fieldName = "time"
    const actual = getRegistryInfoField(moduleName, fieldName)
    
    expect(actual).toEqual(DETOX_TIME)
  })

  test("should return null for non-existing package", () => {
    const moduleName = NON_EXISTING_PACKAGE_NAME
    const fieldName = "time"
    const actual = getRegistryInfoField(moduleName, fieldName)
    
    expect(actual).toEqual(null)
  })

  test("should return null for non-existing field", () => {
    const moduleName = DETOX_NAME
    const fieldName = "if_this_field_exists_then_our_build_deserves_to_break_111111oneoneone"
    const actual = getRegistryInfoField(moduleName, fieldName)
    
    expect(actual).toEqual(null)
  })
})

describe("semverToExactVersion", () => {
  test("should return the latest version", () => {
    const npmModuleName = DETOX_NAME
    const semver = "x"
    const timestamp = (new Date(DETOX_TIME["7.0.1"])).valueOf() + 1

    const version = semverToExactVersion(npmModuleName, timestamp, semver)
    expect(version).toEqual("7.0.1")
  })

  test("should return the latest version matching the semver", () => {
    const npmModuleName = DETOX_NAME
    const semver = "7.0.x"
    const timestamp = (new Date(DETOX_TIME["7.3.0"])).valueOf() + 1

    const version = semverToExactVersion(npmModuleName, timestamp, semver)
    expect(version).toEqual("7.0.1")
  })
  
  test("should ignore versions with tags", () => {
    const npmModuleName = DETOX_NAME
    const semver = "x"
    const timestamp = (new Date(DETOX_TIME["7.0.0-alpha.1"])).valueOf() + 1

    const version = semverToExactVersion(npmModuleName, timestamp, semver)
    expect(version).toEqual("6.0.4")
  })

  test("should return null if no version satisfies semver", () => {
    const npmModuleName = DETOX_NAME
    const semver = "6.3.x"
    const timestamp = (new Date(DETOX_TIME["7.0.0"])).valueOf() + 1

    const version = semverToExactVersion(npmModuleName, timestamp, semver)
    expect(version).toEqual(null)
  })

  test("should return null if no version was released before timestamp", () => {
    const npmModuleName = DETOX_NAME
    const semver = "x"
    const timestamp = (new Date(DETOX_TIME["created"])).valueOf() - 1

    const version = semverToExactVersion(npmModuleName, timestamp, semver)
    expect(version).toEqual(null)
  })

  test("should return null if package doesn't exist", () => {
    const npmModuleName = NON_EXISTING_PACKAGE_NAME
    const semver = "x"
    const timestamp = (new Date(DETOX_TIME["7.0.0"])).valueOf() + 1

    const version = semverToExactVersion(npmModuleName, timestamp, semver)
    expect(version).toEqual(null)
  })
})
