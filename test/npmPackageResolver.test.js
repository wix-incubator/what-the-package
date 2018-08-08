// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
jest.setTimeout(30000)
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

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
    const timestamp =
      new Date(DETOX_VERSION_TO_RELEASE_TIME[DETOX_VERSION]).valueOf() + 1

    const actual = getDependencySemvers(DETOX_NAME, timestamp)

    return expect(actual).resolves.toEqual(DETOX_DEPENDENCIES)
  })

  test("getDevDependencySemvers should return correct devDependencies", () => {
    const timestamp =
      new Date(DETOX_VERSION_TO_RELEASE_TIME[DETOX_VERSION]).valueOf() + 1

    const actual = getDevDependencySemvers(DETOX_NAME, timestamp)

    return expect(actual).resolves.toEqual(DETOX_DEV_DEPENDENCIES)
  })

  test("should throw error message for non-existing package", async () => {
    const timestamp =
      new Date(DETOX_VERSION_TO_RELEASE_TIME[DETOX_VERSION]).valueOf() + 1

    const actual = getDependencySemvers("_wrong-package~)(!*", timestamp)

    await expect(actual).rejects.toThrow()
  })
})
