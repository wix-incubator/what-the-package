// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
jest.setTimeout(30000)
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

const createDependencyComparator = require("../src/createDependencyComparator")
const dataApi = require("../src/npmPackageResolver")
const dayjs = require("dayjs")

const detoxRegistryInfo = require("../data/npm-view-detox-8.json")
const { name: DETOX_NAME, time: DETOX_TIME } = detoxRegistryInfo

describe("createDependencyComparator", () => {
  describe("getExactVersion", () => {
    const { getExactVersion } = createDependencyComparator(dataApi)

    test("should return the latest version", () => {
      const npmModuleName = DETOX_NAME
      const semver = "x"
      const date = dayjs(DETOX_TIME["7.0.1"].valueOf()).subtract(
        -1,
        "millisecond"
      )

      const version = getExactVersion(npmModuleName, date, semver)
      return expect(version).resolves.toEqual("7.0.1")
    })

    test("should return the latest version matching the semver", () => {
      const npmModuleName = DETOX_NAME
      const semver = "7.0.x"
      const date = dayjs(DETOX_TIME["7.3.0"].valueOf()).subtract(
        -1,
        "millisecond"
      )

      const version = getExactVersion(npmModuleName, date, semver)
      return expect(version).resolves.toEqual("7.0.1")
    })

    test("should ignore versions with tags", () => {
      const npmModuleName = DETOX_NAME
      const semver = "x"
      const date = dayjs(DETOX_TIME["7.0.0-alpha.1"].valueOf()).subtract(
        -1,
        "millisecond"
      )

      const version = getExactVersion(npmModuleName, date, semver)
      return expect(version).resolves.toEqual("6.0.4")
    })

    test("should return null if no version satisfies semver", () => {
      const npmModuleName = DETOX_NAME
      const semver = "6.3.x"
      const date = dayjs(DETOX_TIME["7.0.0"].valueOf()).subtract(
        -1,
        "millisecond"
      )

      const version = getExactVersion(npmModuleName, date, semver)
      return expect(version).resolves.toBeNull()
    })

    test("should return null if no version was released before date", () => {
      const npmModuleName = DETOX_NAME
      const semver = "x"
      const date = dayjs(DETOX_TIME["created"]).subtract(1, "millisecond")

      const version = getExactVersion(npmModuleName, date, semver)
      return expect(version).resolves.toBeNull()
    })

    test("should return null if package doesn't exist", () => {
      const semver = "x"
      const date = dayjs(DETOX_TIME["7.0.0"].valueOf()).subtract(
        -1,
        "millisecond"
      )

      const version = getExactVersion("_wrong-package~)(!*", date, semver)
      return expect(version).rejects.toThrow()
    })
  })

  describe("getExactDependencyVersionsAt", () => {
    const { getExactDependencyVersionsAt } = createDependencyComparator(dataApi)

    test("should return correct result", async () => {
      const npmModuleName = `${DETOX_NAME}`
      const date = dayjs(DETOX_TIME["2.0.0"].valueOf()).subtract(
        -1,
        "millisecond"
      )

      const result = await getExactDependencyVersionsAt(npmModuleName, date)

      return expect(result).toEqual({
        "babel-cli": "6.10.1",
        "babel-core": "6.9.1",
        "babel-eslint": "6.0.4",
        "babel-polyfill": "6.9.1",
        "babel-preset-es2015": "6.9.0",
        "babel-preset-react": "6.5.0",
        "babel-preset-stage-0": "6.5.0",
        "babel-register": "6.9.0"
      })
    })
  })

  describe("compareNpmModuleDependencies", () => {
    const { compareNpmModuleDependencies } = createDependencyComparator(dataApi)

    test("should calculate dependecy diff for detox module", () => {
      const npmModuleName = DETOX_NAME
      const priorDate = dayjs(DETOX_TIME["7.0.0"].valueOf()).subtract(
        -1,
        "millisecond"
      )
      const latterDate = dayjs(DETOX_TIME["8.0.0"].valueOf()).subtract(
        -1,
        "millisecond"
      )

      const result = compareNpmModuleDependencies(
        npmModuleName,
        priorDate,
        latterDate
      )

      return expect(result).resolves.toEqual([
        {
          latterVersion: "2.2.1",
          packageName: "child-process-promise",
          priorVersion: "2.2.1"
        },
        {
          latterVersion: "2.15.1",
          packageName: "commander",
          priorVersion: "2.13.0"
        },
        {
          latterVersion: "7.0.0",
          packageName: "detox-server",
          priorVersion: "7.0.0"
        },
        {
          latterVersion: "4.0.3",
          packageName: "fs-extra",
          priorVersion: "4.0.3"
        },
        {
          latterVersion: "2.1.0",
          packageName: "get-port",
          priorVersion: "2.1.0"
        },
        { latterVersion: "1.3.5", packageName: "ini", priorVersion: "1.3.5" },
        {
          latterVersion: "4.17.10",
          packageName: "lodash",
          priorVersion: "4.17.4"
        },
        {
          latterVersion: "4.1.2",
          packageName: "npmlog",
          priorVersion: "4.1.2"
        },
        {
          latterVersion: "1.0.10",
          packageName: "shell-utils",
          priorVersion: "1.0.9"
        },
        { latterVersion: "1.2.3", packageName: "tail", priorVersion: "1.2.3" },
        {
          latterVersion: "0.15.3",
          packageName: "telnet-client",
          priorVersion: "0.15.3"
        },
        { latterVersion: "1.1.5", packageName: "ws", priorVersion: "1.1.5" },
        {
          latterVersion: "4.19.1",
          packageName: "eslint",
          priorVersion: "4.16.0"
        },
        {
          latterVersion: null,
          packageName: "eslint-config-prettier",
          priorVersion: "2.5.0"
        },
        {
          latterVersion: null,
          packageName: "eslint-plugin-jest",
          priorVersion: "20.0.3"
        },
        {
          latterVersion: null,
          packageName: "eslint-plugin-prettier",
          priorVersion: "2.2.0"
        },
        {
          latterVersion: null,
          packageName: "eslint-plugin-promise",
          priorVersion: "3.6.0"
        },
        {
          latterVersion: null,
          packageName: "eslint-plugin-react",
          priorVersion: "7.6.0"
        },
        {
          latterVersion: null,
          packageName: "eslint-plugin-react-native",
          priorVersion: "3.2.1"
        },
        {
          latterVersion: "22.4.4",
          packageName: "jest",
          priorVersion: "20.0.4"
        },
        {
          latterVersion: "1.2.0",
          packageName: "minimist",
          priorVersion: "1.2.0"
        },
        {
          latterVersion: "2.0.2",
          packageName: "mockdate",
          priorVersion: "2.0.2"
        },
        {
          latterVersion: "1.7.0",
          packageName: "prettier",
          priorVersion: "1.7.0"
        },
        {
          latterVersion: "3.0.2",
          packageName: "proper-lockfile",
          priorVersion: null
        },
        { latterVersion: "2.0.0", packageName: "tempfile", priorVersion: null },
        {
          latterVersion: "6.0.1",
          packageName: "eslint-plugin-node",
          priorVersion: null
        }
      ])
    })

    test("should reject if latter is before prior", async () => {
      const npmModuleName = DETOX_NAME
      const invalidPriorDate = dayjs(DETOX_TIME["8.0.0"].valueOf())
      const invalidLatterDate = dayjs(DETOX_TIME["2.0.0"].valueOf())

      return expect(
        compareNpmModuleDependencies(
          npmModuleName,
          invalidPriorDate,
          invalidLatterDate
        )
      ).rejects.toThrow()
    })

    test("should reject if something went wrong", () => {
      const npmModuleName =
        "a-non-existent-package---what-are-the-odds-there-will-be"
      const priorDate = dayjs(DETOX_TIME["7.0.0"].valueOf())
      const latterDate = dayjs(DETOX_TIME["8.0.0"].valueOf())

      const result = compareNpmModuleDependencies(
        npmModuleName,
        priorDate,
        latterDate
      )

      return expect(result).rejects.toThrow()
    })
  })
})
