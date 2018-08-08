const util = require("util")
const path = require("path")
const fs = require("fs")
const exec = util.promisify(require("child_process").exec)
const rimraf = util.promisify(require("rimraf"))

const {
  getDependencySemvers,
  getDevDependencySemvers
} = require("../src/git-data-service")

describe("gitDataService", () => {
  const tempDir = path.resolve(__dirname, "./.tmp")
  const testDir = path.resolve(tempDir, "./gitDataService")
  const packageJson = {
    "name": "mock-project",
    "version": "1.0.0",
    "devDependencies": {
      "some-package-name-for-mock": "1.0.1"
    },
    "dependencies": {
      "yet-another-package-name-for-mock": "2.0.2"
    }
  }

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

    await util.promisify(fs.writeFile)(`${testDir}/package.json`, JSON.stringify(packageJson), 'utf8')

    await initGitRepo(testDir)
    await gitCommit(testDir)
  })

  afterEach(async () => {
    await rimraf(tempDir)
  })

  test("should return package.json dependencies content", async () => {
    const timestamp = getCurrentUnixTimeWithShift(100)
    const dependencies = await getDependencySemvers(testDir, timestamp)
    const devDependencies = await getDevDependencySemvers(testDir, timestamp)

    expect(dependencies).toEqual(packageJson.dependencies)
    expect(devDependencies).toEqual(packageJson.devDependencies)
  })

  test("should throw if given gitDir doesn't exist", async () => {
    const timestamp = getCurrentUnixTimeWithShift()

    await expect(getDependencySemvers(path.resolve(tempDir, './wrong-directory'), timestamp)).rejects.toThrow()
  })

  test("should throw if couldn't find package.json in given gitDir", async () => {
    const timestamp = getCurrentUnixTimeWithShift()

    await util.promisify(fs.unlink)(`${testDir}/package.json`)
    await expect(getDependencySemvers(testDir, timestamp)).rejects.toThrow()
  })

  test("should throw if there are not commits before given timestamp", async () => {
    const timestamp = getCurrentUnixTimeWithShift(-10000) // some date in past

    await expect(getDependencySemvers(testDir, timestamp)).rejects.toThrow()
  })
})
