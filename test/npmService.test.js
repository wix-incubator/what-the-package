const _ = require("lodash")
const { getPackageReleases } = require("../src/npmService")
const detoxRegistryInfo = require("../data/npm-view-detox-8.json")

const {
  name: DETOX_NAME,
  time: DETOX_VERSION_TO_RELEASE_TIME,
  version: DETOX_VERSION
} = detoxRegistryInfo

const omitModifiedVersion = releaseTimes =>
  _.pickBy(releaseTimes, (releaseTime, version) => version !== "modified")

describe("npmService", () => {
  test("getPackageReleases: should return correct release times", async () => {
    const detoxTimeWithoutModified = omitModifiedVersion(
      DETOX_VERSION_TO_RELEASE_TIME
    )
    const detoxLatestReleaseTime = DETOX_VERSION_TO_RELEASE_TIME[DETOX_VERSION]

    const upToDateReleaseTimes = await getPackageReleases(DETOX_NAME)
    const releaseTimesAppearingInMockData = _.pickBy(
      upToDateReleaseTimes,
      (releaseTime, version) =>
        releaseTime <= detoxLatestReleaseTime && version !== "modified"
    )

    expect(releaseTimesAppearingInMockData).toEqual(detoxTimeWithoutModified)
  })

  test.skip("view: should return info for package", () => {
    // TODO
  })

  test.skip("view: should throw exception for non-existing package", () => {
    // TODO
  })
})
