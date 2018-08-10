// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
jest.setTimeout(30000)
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

const moment = require("moment")

const {
  getDependencySemvers,
  getDevDependencySemvers
} = require("../src/npmPackageResolver")

const detoxRegistryInfo = require("../data/npm-view-detox-8.json")

const {
  dependencies: DETOX_DEPENDENCIES,
  devDependencies: DETOX_DEV_DEPENDENCIES,
  name: DETOX_NAME,
  time: DETOX_VERSION_TO_RELEASE_TIME,
  version: DETOX_VERSION
} = detoxRegistryInfo

describe("npmPackageResolver", () => {
  test("getDependencySemvers should return correct dependencies", async () => {
    const date = moment(
      DETOX_VERSION_TO_RELEASE_TIME[DETOX_VERSION].valueOf()
    ).subtract(-1, "millisecond")

    const actual = getDependencySemvers(DETOX_NAME, date)

    return expect(actual).resolves.toEqual(DETOX_DEPENDENCIES)
  })

  test("getDevDependencySemvers should return correct devDependencies", () => {
    const date = moment(
      DETOX_VERSION_TO_RELEASE_TIME[DETOX_VERSION].valueOf()
    ).subtract(-1, "millisecond")

    const actual = getDevDependencySemvers(DETOX_NAME, date)

    return expect(actual).resolves.toEqual(DETOX_DEV_DEPENDENCIES)
  })

  test("should throw error message for non-existing package", async () => {
    const date = moment(
      DETOX_VERSION_TO_RELEASE_TIME[DETOX_VERSION].valueOf()
    ).subtract(-1, "millisecond")

    const actual = getDependencySemvers("_wrong-package~)(!*", date)

    await expect(actual).rejects.toThrow()
  })
})
