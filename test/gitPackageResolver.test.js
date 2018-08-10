const util = require("util")
const path = require("path")
const fs = require("fs")
const exec = util.promisify(require("child_process").exec)
const rimraf = util.promisify(require("rimraf"))
const moment = require("moment")

const {
  getDependencySemvers,
  getDevDependencySemvers
} = require("../src/gitPackageResolver")

describe("gitPackageResolver", () => {
  const tempDir = path.resolve(__dirname, "./.tmp")
  const testDir = path.resolve(tempDir, "./gitDataService")
  const packageJson = {
    name: "mock-project",
    version: "1.0.0",
    devDependencies: {
      "some-package-name-for-mock": "1.0.1"
    },
    dependencies: {
      "yet-another-package-name-for-mock": "2.0.2"
    }
  }

  const initGitRepo = async dirPath => {
    return exec(`cd ${dirPath} && git init`, { encoding: "utf8" })
  }

  const gitCommit = async dirPath => {
    return exec(`cd ${dirPath} && git add . && git commit -m 'test-commit'`)
  }

  beforeEach(async () => {
    await rimraf(tempDir)
    await util.promisify(fs.mkdir)(tempDir)
    await util.promisify(fs.mkdir)(testDir)

    await util.promisify(fs.writeFile)(
      `${testDir}/package.json`,
      JSON.stringify(packageJson),
      "utf8"
    )

    await initGitRepo(testDir)
    await gitCommit(testDir)
  })

  afterEach(async () => {
    await rimraf(tempDir)
  })

  test("should return package.json dependencies content", async () => {
    const date = moment().subtract(-100, "second")
    const dependencies = await getDependencySemvers(testDir, date)
    const devDependencies = await getDevDependencySemvers(testDir, date)

    expect(dependencies).toEqual(packageJson.dependencies)
    expect(devDependencies).toEqual(packageJson.devDependencies)
  })

  test("should throw if given gitDir doesn't exist", async () => {
    const date = moment().subtract(-100, "second")

    await expect(
      getDependencySemvers(path.resolve(tempDir, "./wrong-directory"), date)
    ).rejects.toThrow()
  })

  test("should throw if couldn't find package.json in given gitDir", async () => {
    const date = moment().subtract(-100, "second")

    await util.promisify(fs.unlink)(`${testDir}/package.json`)
    await expect(getDependencySemvers(testDir, date)).rejects.toThrow()
  })

  test("should throw if there are not commits before given date", async () => {
    const date = moment().subtract(10000, "second")

    await expect(getDependencySemvers(testDir, date)).rejects.toThrow()
  })
})
