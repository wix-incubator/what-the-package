// // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
// jest.setTimeout(30000)
// // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

// const {
//   compareNpmModuleDependencies,
//   getExactDependencyVersionsAt,
//   getExactVersion,
//   getRegistryInfoField,
//   getVersionsComparison,
//   getVersionsDiff
// } = require("../src/utils")

// const detoxRegistryInfo = require("../data/npm-view-detox-8.json")

// const {
//   dependencies: DETOX_DEPENDENCIES,
//   devDependencies: DETOX_DEV_DEPENDENCIES,
//   name: DETOX_NAME,
//   time: DETOX_TIME,
//   version: DETOX_VERSION
// } = detoxRegistryInfo

// const NON_EXISTING_PACKAGE_NAME =
//   "if_this_packages_exists_then_our_build_deserves_to_break_111111oneoneone"

// describe("getExactVersion", () => {
//   test("should return the latest version", () => {
//     const npmModuleName = DETOX_NAME
//     const semver = "x"
//     const timestamp = new Date(DETOX_TIME["7.0.1"]).valueOf() + 1

//     const version = getExactVersion(npmModuleName, timestamp, semver)
//     return expect(version).resolves.toEqual("7.0.1")
//   })

//   test("should return the latest version matching the semver", () => {
//     const npmModuleName = DETOX_NAME
//     const semver = "7.0.x"
//     const timestamp = new Date(DETOX_TIME["7.3.0"]).valueOf() + 1

//     const version = getExactVersion(npmModuleName, timestamp, semver)
//     return expect(version).resolves.toEqual("7.0.1")
//   })

//   test("should ignore versions with tags", () => {
//     const npmModuleName = DETOX_NAME
//     const semver = "x"
//     const timestamp = new Date(DETOX_TIME["7.0.0-alpha.1"]).valueOf() + 1

//     const version = getExactVersion(npmModuleName, timestamp, semver)
//     return expect(version).resolves.toEqual("6.0.4")
//   })

//   test("should return null if no version satisfies semver", () => {
//     const npmModuleName = DETOX_NAME
//     const semver = "6.3.x"
//     const timestamp = new Date(DETOX_TIME["7.0.0"]).valueOf() + 1

//     const version = getExactVersion(npmModuleName, timestamp, semver)
//     return expect(version).resolves.toBeNull()
//   })

//   test("should return null if no version was released before timestamp", () => {
//     const npmModuleName = DETOX_NAME
//     const semver = "x"
//     const timestamp = new Date(DETOX_TIME["created"]).valueOf() - 1

//     const version = getExactVersion(npmModuleName, timestamp, semver)
//     return expect(version).resolves.toBeNull()
//   })

//   test("should return null if package doesn't exist", () => {
//     const npmModuleName = NON_EXISTING_PACKAGE_NAME
//     const semver = "x"
//     const timestamp = new Date(DETOX_TIME["7.0.0"]).valueOf() + 1

//     const version = getExactVersion(npmModuleName, timestamp, semver)
//     return expect(version).rejects.toThrow()
//   })
// })

// describe("getExactDependencyVersionsAt", () => {
//   test("should return correct result", () => {
//     const npmModuleName = `${DETOX_NAME}`
//     const timestamp = new Date(DETOX_TIME["2.0.0"]).valueOf() + 1

//     const result = getExactDependencyVersionsAt(npmModuleName, timestamp)
//     return expect(result).resolves.toEqual({
//       "babel-cli": "6.10.1",
//       "babel-core": "6.9.1",
//       "babel-eslint": "6.0.4",
//       "babel-polyfill": "6.9.1",
//       "babel-preset-es2015": "6.9.0",
//       "babel-preset-react": "6.5.0",
//       "babel-preset-stage-0": "6.5.0",
//       "babel-register": "6.9.0"
//     })
//   })
// })

// describe("getVersionsComparison", () => {
//   test("should be correct", () => {
//     const priorVersions = {
//       "package-A": "5",
//       "package-B": "5",
//       "package-C": "5"
//     }
//     const latterVersions = {
//       "package-B": "5",
//       "package-C": "17",
//       "package-D": "6"
//     }

//     const versionsComparison = getVersionsComparison(
//       priorVersions,
//       latterVersions
//     )

//     expect(versionsComparison).toEqual({
//       "package-A": {
//         priorVersion: "5",
//         latterVersion: null
//       },
//       "package-B": {
//         priorVersion: "5",
//         latterVersion: "5"
//       },
//       "package-C": {
//         priorVersion: "5",
//         latterVersion: "17"
//       },
//       "package-D": {
//         priorVersion: null,
//         latterVersion: "6"
//       }
//     })
//   })
// })

// describe.skip("getVersionsDiff", () => {
//   test("should return only versions that changed", () => {
//     const priorVersions = {
//       "babel-cli": "6.10.1",
//       "babel-core": "6.9.1",
//       "babel-eslint": "6.0.4"
//     }
//     const latterVersions = {
//       "babel-cli": "6.10.1",
//       "babel-core": "7.0.0",
//       "babel-polyfill": "6.9.1"
//     }

//     const diff = getVersionsDiff(priorVersions, latterVersions)

//     expect(diff).toEqual({
//       "babel-core": {
//         latterVersion: "7.0.0",
//         priorVersion: "6.9.1"
//       },
//       "babel-eslint": {
//         latterVersion: null,
//         priorVersion: "6.0.4"
//       },
//       "babel-polyfill": {
//         latterVersion: "6.9.1",
//         priorVersion: null
//       }
//     })
//   })
// })

// describe("compareNpmModuleDependencies", () => {
//   test("should calculate dependecy diff for detox module", () => {
//     const npmModuleName = DETOX_NAME
//     const priorTimestamp = new Date(DETOX_TIME["7.0.0"]).valueOf() + 1
//     const latterTimestamp = new Date(DETOX_TIME["8.0.0"]).valueOf() + 1

//     const result = compareNpmModuleDependencies(
//       npmModuleName,
//       priorTimestamp,
//       latterTimestamp
//     )

//     return expect(result).resolves.toEqual({
//       "child-process-promise": {
//         latterVersion: "2.2.1",
//         priorVersion: "2.2.1"
//       },
//       commander: { latterVersion: "2.15.1", priorVersion: "2.13.0" },
//       "detox-server": { latterVersion: "7.0.0", priorVersion: "7.0.0" },
//       eslint: { latterVersion: "4.19.1", priorVersion: "4.16.0" },
//       "eslint-config-prettier": { latterVersion: null, priorVersion: "2.5.0" },
//       "eslint-plugin-jest": { latterVersion: null, priorVersion: "20.0.3" },
//       "eslint-plugin-node": { latterVersion: "6.0.1", priorVersion: null },
//       "eslint-plugin-prettier": { latterVersion: null, priorVersion: "2.2.0" },
//       "eslint-plugin-promise": { latterVersion: null, priorVersion: "3.6.0" },
//       "eslint-plugin-react": { latterVersion: null, priorVersion: "7.6.0" },
//       "eslint-plugin-react-native": {
//         latterVersion: null,
//         priorVersion: "3.2.1"
//       },
//       "fs-extra": { latterVersion: "4.0.3", priorVersion: "4.0.3" },
//       "get-port": { latterVersion: "2.1.0", priorVersion: "2.1.0" },
//       ini: { latterVersion: "1.3.5", priorVersion: "1.3.5" },
//       jest: { latterVersion: "22.4.4", priorVersion: "20.0.4" },
//       lodash: { latterVersion: "4.17.10", priorVersion: "4.17.4" },
//       minimist: { latterVersion: "1.2.0", priorVersion: "1.2.0" },
//       mockdate: { latterVersion: "2.0.2", priorVersion: "2.0.2" },
//       npmlog: { latterVersion: "4.1.2", priorVersion: "4.1.2" },
//       prettier: { latterVersion: "1.7.0", priorVersion: "1.7.0" },
//       "proper-lockfile": { latterVersion: "3.0.2", priorVersion: null },
//       "shell-utils": { latterVersion: "1.0.10", priorVersion: "1.0.9" },
//       tail: { latterVersion: "1.2.3", priorVersion: "1.2.3" },
//       "telnet-client": { latterVersion: "0.15.3", priorVersion: "0.15.3" },
//       tempfile: { latterVersion: "2.0.0", priorVersion: null },
//       ws: { latterVersion: "1.1.5", priorVersion: "1.1.5" }
//     })
//   })

//   test("should reject if latter is before prior", () => {
//     const npmModuleName = DETOX_NAME
//     const invalidPriorTimestamp = new Date(DETOX_TIME["8.0.0"]).valueOf()
//     const invalidLatterTimestamp = new Date(DETOX_TIME["2.0.0"]).valueOf()

//     return expect(
//       compareNpmModuleDependencies(
//         npmModuleName,
//         invalidPriorTimestamp,
//         invalidLatterTimestamp
//       )
//     ).rejects.toThrow()
//   })

//   test("should reject if something went wrong", () => {
//     const npmModuleName =
//       "a-non-existent-package---what-are-the-odds-there-will-be"
//     const priorTimestamp = new Date(DETOX_TIME["7.0.0"]).valueOf()
//     const latterTimestamp = new Date(DETOX_TIME["8.0.0"]).valueOf()

//     const result = compareNpmModuleDependencies(
//       npmModuleName,
//       priorTimestamp,
//       latterTimestamp
//     )

//     return expect(result).rejects.toThrow()
//   })
// })
