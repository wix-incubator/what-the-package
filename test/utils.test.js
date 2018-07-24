const {
  getRegistryInfoField
} = require("../src/utils")

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
    const actual = getRegistryInfoField({moduleName, fieldName})
    
    expect(actual).toEqual(DETOX_DEPENDENCIES)
  })

  test("should return correct devDependencies", () => {
    const moduleName = `${DETOX_NAME}@${DETOX_VERSION}`
    const fieldName = "devDependencies"
    const actual = getRegistryInfoField({moduleName, fieldName})
    
    expect(actual).toEqual(DETOX_DEV_DEPENDENCIES)
  })

  test("should return correct release times", () => {
    const moduleName = `${DETOX_NAME}@${DETOX_VERSION}`
    const fieldName = "time"
    const actual = getRegistryInfoField({moduleName, fieldName})
    
    expect(actual).toEqual(DETOX_TIME)
  })

  test("should return null for non-existing package", () => {
    const moduleName = "if_this_packages_exists_then_our_build_deserves_to_break_111111oneoneone"
    const fieldName = "time"
    const actual = getRegistryInfoField({moduleName, fieldName})
    
    expect(actual).toEqual(null)
  })

  test("should return null for non-existing field", () => {
    const moduleName = DETOX_NAME
    const fieldName = "if_this_field_exists_then_our_build_deserves_to_break_111111oneoneone"
    const actual = getRegistryInfoField({moduleName, fieldName})
    
    expect(actual).toEqual(null)
  })
})
