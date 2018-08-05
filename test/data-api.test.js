const _ = require("lodash")
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
  time: DETOX_VERSION_TO_RELEASE_TIME,
  version: DETOX_VERSION
} = detoxRegistryInfo

const NON_EXISTING_PACKAGE_NAME =
  "if_this_packages_exists_then_our_build_deserves_to_break_111111oneoneone"

const omitModifiedVersion = releaseTimes =>
  _.pickBy(releaseTimes, (releaseTime, version) => version !== "modified")


describe("data-api", () => {
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

  test("getReleaseTimes should return correct release times", async () => {
    const detoxTimeWithoutModified = omitModifiedVersion(
      DETOX_VERSION_TO_RELEASE_TIME
    )
    const detoxLatestReleaseTime = DETOX_VERSION_TO_RELEASE_TIME[DETOX_VERSION]

    const upToDateReleaseTimes = await getReleaseTimes(DETOX_NAME)
    const releaseTimesAppearingInMockData = _.pickBy(
      upToDateReleaseTimes,
      (releaseTime, version) =>
        releaseTime <= detoxLatestReleaseTime && version !== "modified"
    )

    expect(releaseTimesAppearingInMockData).toEqual(detoxTimeWithoutModified)
  })

  test("should return error message for non-existing package", async () => {
    const actual = getReleaseTimes(NON_EXISTING_PACKAGE_NAME)
    return expect(actual).rejects.toThrow()
  })
})
