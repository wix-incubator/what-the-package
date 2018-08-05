const path = require("path")
const _ = require("lodash")
const {
  getDependencySemvers,
  getDevDependencySemvers,
  getReleaseTimes,
  getPackageJsonFromGitAt,
} = require("../src/data-api")

const detoxRegistryInfo = require("../data/npm-view-detox-8.json")

const mockProjectPastPackageJson = require("../data/mock-project-at-2018-08-05_01-30-21-package")

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

describe("getPackageJsonFromGitAt", () => {
  test("should return package.json content", async () => {
    const mockProjectGitDirPath = path.resolve(__dirname, "../data/mock-project")
    const timestamp = new Date("Sun Aug 5 01:30:21 2018 +0300").valueOf() + 1

    const pj = await getPackageJsonFromGitAt(timestamp, mockProjectGitDirPath)

    expect(pj).toEqual(mockProjectPastPackageJson)
  })

  test.skip("should throw if given gitDir doesn't exist", () => {
    expect(true).toEqual(false)
  })

  test.skip("should throw if couldn't find package.json in given gitDir", () => {
    expect(true).toEqual(false)
  })

  test.skip("should throw if there are not commits before given timestamp", () => {
    expect(true).toEqual(false)
  })
})
