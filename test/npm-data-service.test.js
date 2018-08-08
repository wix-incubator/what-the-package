// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
jest.setTimeout(30000)
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

const _ = require("lodash")
jest.mock('../src/npm-service.js')
const npmService = require('../src/npm-service.js')

const {
  getDependencySemvers,
  getDevDependencySemvers
} = require("../src/npm-data-service")

// jest.mock('./npm-service', () => {
//   let viewMock
//   let packageReleasesMock
//
//   const __setViewMock = (newViewMock) => {
//     viewMock = newViewMock
//   }
//
//   const __setPackageReleasesMock = (newPackageReleasesMock) => {
//     packageReleasesMock = newPackageReleasesMock
//   }
//
//   const view = () => Promise.resolve({
//     stdout: viewMock
//   })
//
//   const getPackageReleases = () => Promise.resolve({
//     stdout: packageReleasesMock
//   })
//
//   return {
//     view,
//     getPackageReleases,
//     __setViewMock,
//     __setPackageReleasesMock
//   }
// })

const detoxRegistryInfo = require("../data/npm-view-detox-8.json")

const {
  dependencies: DETOX_DEPENDENCIES,
  devDependencies: DETOX_DEV_DEPENDENCIES,
  name: DETOX_NAME,
  time: DETOX_VERSION_TO_RELEASE_TIME,
  version: DETOX_VERSION
} = detoxRegistryInfo

const omitModifiedVersion = releaseTimes =>
  _.pickBy(releaseTimes, (releaseTime, version) => version !== "modified")


describe("npm-data-service", () => {
  test("getDependencySemvers should return correct dependencies", async () => {
    console.log('NpmService=', npmService);
    npmService.view.mockImplementation((param) => {
      console.log('Arguments=', param);

      return Promise.resolve({
        stdout: DETOX_VERSION_TO_RELEASE_TIME
      })
    })
    // require('../src/npm-service').__setPackageReleasesMock(DETOX_VERSION_TO_RELEASE_TIME)

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

  // TODO discuss with Nick
  test.skip("getReleaseTimes should return correct release times", async () => {
    const detoxTimeWithoutModified = omitModifiedVersion(DETOX_VERSION_TO_RELEASE_TIME)
    const detoxLatestReleaseTime = DETOX_VERSION_TO_RELEASE_TIME[DETOX_VERSION]

    const upToDateReleaseTimes = await getPackageReleases(DETOX_NAME)
    const releaseTimesAppearingInMockData = _.pickBy(
      upToDateReleaseTimes,
      (releaseTime, version) =>
        releaseTime <= detoxLatestReleaseTime && version !== "modified"
    )

    expect(releaseTimesAppearingInMockData).toEqual(detoxTimeWithoutModified)
  })

  test("should throw error message for non-existing package", async () => {
    const timestamp =
      new Date(DETOX_VERSION_TO_RELEASE_TIME[DETOX_VERSION]).valueOf() + 1
    const actual = getDependencySemvers("_wrong-package~)(!*", timestamp)

    await expect(actual).rejects.toThrow()
  })
})
