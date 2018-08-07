// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
jest.setTimeout(30000)
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

const path = require("path")
const _ = require("lodash")
const util = require("util")
const fs = require("fs")
const exec = util.promisify(require("child_process").exec)
const rimraf = util.promisify(require("rimraf"))

const {
  getDependencySemvers,
  getDevDependencySemvers,
  getReleaseTimes,
  getPackageJsonFromGitAt,
} = require("../src/data-api")

const detoxRegistryInfo = require("../data/npm-view-detox-8.json")

const mockProjectPastPackageJson = require("../data/mock-package.json")

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
  let tempDir = path.resolve(__dirname, "./.tmp")
  let testDir = path.resolve(tempDir, "./getPackageJsonFromGitAt")

  const initGitRepo = async (dirPath) => {
    return exec(`cd ${dirPath} && git init`, {encoding: "utf8"})
  }

  const gitCommit = async (dirPath) => {
    return exec(`cd ${dirPath} && git add . && git commit -m 'test-commit'`)
  }

  const getCurrentUnixTimeWithShift = (shiftInSeconds = 0) => {
    return Math.floor((new Date().valueOf() / 1000) + shiftInSeconds)
  }

  beforeEach(async () => {
    await rimraf(tempDir)
    await util.promisify(fs.mkdir)(tempDir)
    await util.promisify(fs.mkdir)(testDir)

    await util.promisify(fs.writeFile)(`${testDir}/package.json`, JSON.stringify(mockProjectPastPackageJson), 'utf8')

    await initGitRepo(testDir)
    await gitCommit(testDir)
  })

  afterEach(async () => {
    await rimraf(tempDir)
  })

  test("should return package.json content", async () => {
    const timestamp = getCurrentUnixTimeWithShift(10000000000)
    const packageJson = await getPackageJsonFromGitAt(timestamp, testDir)

    expect(packageJson).toEqual(mockProjectPastPackageJson)
  })

  test("should throw if given gitDir doesn't exist", async () => {
    const timestamp = getCurrentUnixTimeWithShift()

    await expect(getPackageJsonFromGitAt(timestamp, path.resolve(tempDir, './wrong-directory'))).rejects.toThrow()
  })

  test("should throw if couldn't find package.json in given gitDir", async () => {
    const timestamp = getCurrentUnixTimeWithShift()

    await util.promisify(fs.unlink)(`${testDir}/package.json`)
    await expect(getPackageJsonFromGitAt(timestamp, testDir)).rejects.toThrow()
  })

  test("should throw if there are not commits before given timestamp", async () => {
    const timestamp = getCurrentUnixTimeWithShift(-10000) // some date in past

    await expect(getPackageJsonFromGitAt(timestamp, testDir)).rejects.toThrow()
  })
})
