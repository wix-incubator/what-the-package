// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
jest.setTimeout(30000)
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

const createDependencyComparator = require("../src/createDependencyComparator")
const dataApi = require("../src/npm-package-resolver")

const detoxRegistryInfo = require("../data/npm-view-detox-8.json")
const { name: DETOX_NAME, time: DETOX_TIME } = detoxRegistryInfo

describe("createDependencyComparator", () => {
  describe("getExactVersion", () => {
    const {getExactVersion} = createDependencyComparator(dataApi)

    test("should return the latest version", () => {
      const npmModuleName = DETOX_NAME
      const semver = "x"
      const timestamp = new Date(DETOX_TIME["7.0.1"]).valueOf() + 1

      const version = getExactVersion(npmModuleName, timestamp, semver)
      return expect(version).resolves.toEqual("7.0.1")
    })

    test("should return the latest version matching the semver", () => {
      const npmModuleName = DETOX_NAME
      const semver = "7.0.x"
      const timestamp = new Date(DETOX_TIME["7.3.0"]).valueOf() + 1

      const version = getExactVersion(npmModuleName, timestamp, semver)
      return expect(version).resolves.toEqual("7.0.1")
    })

    test("should ignore versions with tags", () => {
      const npmModuleName = DETOX_NAME
      const semver = "x"
      const timestamp = new Date(DETOX_TIME["7.0.0-alpha.1"]).valueOf() + 1

      const version = getExactVersion(npmModuleName, timestamp, semver)
      return expect(version).resolves.toEqual("6.0.4")
    })

    test("should return null if no version satisfies semver", () => {
      const npmModuleName = DETOX_NAME
      const semver = "6.3.x"
      const timestamp = new Date(DETOX_TIME["7.0.0"]).valueOf() + 1

      const version = getExactVersion(npmModuleName, timestamp, semver)
      return expect(version).resolves.toBeNull()
    })

    test("should return null if no version was released before timestamp", () => {
      const npmModuleName = DETOX_NAME
      const semver = "x"
      const timestamp = new Date(DETOX_TIME["created"]).valueOf() - 1

      const version = getExactVersion(npmModuleName, timestamp, semver)
      return expect(version).resolves.toBeNull()
    })

    test("should return null if package doesn't exist", () => {
      const semver = "x"
      const timestamp = new Date(DETOX_TIME["7.0.0"]).valueOf() + 1

      const version = getExactVersion('_wrong-package~)(!*', timestamp, semver)
      return expect(version).rejects.toThrow()
    })
  })

  describe("getExactDependencyVersionsAt", () => {
    const {getExactDependencyVersionsAt} = createDependencyComparator(dataApi)

    test("should return correct result", async () => {
      const npmModuleName = `${DETOX_NAME}`
      const timestamp = new Date(DETOX_TIME["2.0.0"]).valueOf() + 1

      const result = await getExactDependencyVersionsAt(npmModuleName, timestamp)

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
    const {compareNpmModuleDependencies} = createDependencyComparator(dataApi)

    test("should calculate dependecy diff for detox module", () => {
      const npmModuleName = DETOX_NAME
      const priorTimestamp = new Date(DETOX_TIME["7.0.0"]).valueOf() + 1
      const latterTimestamp = new Date(DETOX_TIME["8.0.0"]).valueOf() + 1

      const result = compareNpmModuleDependencies(
        npmModuleName,
        priorTimestamp,
        latterTimestamp
      )

      return expect(result).resolves.toEqual({
        "child-process-promise": {
          latterVersion: "2.2.1",
          priorVersion: "2.2.1"
        },
        commander: {latterVersion: "2.15.1", priorVersion: "2.13.0"},
        "detox-server": {latterVersion: "7.0.0", priorVersion: "7.0.0"},
        eslint: {latterVersion: "4.19.1", priorVersion: "4.16.0"},
        "eslint-config-prettier": {latterVersion: null, priorVersion: "2.5.0"},
        "eslint-plugin-jest": {latterVersion: null, priorVersion: "20.0.3"},
        "eslint-plugin-node": {latterVersion: "6.0.1", priorVersion: null},
        "eslint-plugin-prettier": {latterVersion: null, priorVersion: "2.2.0"},
        "eslint-plugin-promise": {latterVersion: null, priorVersion: "3.6.0"},
        "eslint-plugin-react": {latterVersion: null, priorVersion: "7.6.0"},
        "eslint-plugin-react-native": {
          latterVersion: null,
          priorVersion: "3.2.1"
        },
        "fs-extra": {latterVersion: "4.0.3", priorVersion: "4.0.3"},
        "get-port": {latterVersion: "2.1.0", priorVersion: "2.1.0"},
        ini: {latterVersion: "1.3.5", priorVersion: "1.3.5"},
        jest: {latterVersion: "22.4.4", priorVersion: "20.0.4"},
        lodash: {latterVersion: "4.17.10", priorVersion: "4.17.4"},
        minimist: {latterVersion: "1.2.0", priorVersion: "1.2.0"},
        mockdate: {latterVersion: "2.0.2", priorVersion: "2.0.2"},
        npmlog: {latterVersion: "4.1.2", priorVersion: "4.1.2"},
        prettier: {latterVersion: "1.7.0", priorVersion: "1.7.0"},
        "proper-lockfile": {latterVersion: "3.0.2", priorVersion: null},
        "shell-utils": {latterVersion: "1.0.10", priorVersion: "1.0.9"},
        tail: {latterVersion: "1.2.3", priorVersion: "1.2.3"},
        "telnet-client": {latterVersion: "0.15.3", priorVersion: "0.15.3"},
        tempfile: {latterVersion: "2.0.0", priorVersion: null},
        ws: {latterVersion: "1.1.5", priorVersion: "1.1.5"}
      })
    })

    test("should reject if latter is before prior", async () => {
      const npmModuleName = DETOX_NAME
      const invalidPriorTimestamp = new Date(DETOX_TIME["8.0.0"]).valueOf()
      const invalidLatterTimestamp = new Date(DETOX_TIME["2.0.0"]).valueOf()

      return expect(
        compareNpmModuleDependencies(
          npmModuleName,
          invalidPriorTimestamp,
          invalidLatterTimestamp
        )
      ).rejects.toThrow()
    })

    test("should reject if something went wrong", () => {
      const npmModuleName =
        "a-non-existent-package---what-are-the-odds-there-will-be"
      const priorTimestamp = new Date(DETOX_TIME["7.0.0"]).valueOf()
      const latterTimestamp = new Date(DETOX_TIME["8.0.0"]).valueOf()

      const result = compareNpmModuleDependencies(
        npmModuleName,
        priorTimestamp,
        latterTimestamp
      )

      return expect(result).rejects.toThrow()
    })
  })
})
