const _ = require("lodash")
const path = require("path")
const {
  getDepsFromPackageJson,
  getReleaseTimes,
  resolveDependencyVersion,
  getVersionsAtTimestamp,
} = require("../src/main")
const detoxReleaseTimes = require("../data/detox-release-times.json")

const pathToJson = path.resolve(__dirname, "../data/detox.package.json")

test("should get dependencies from the test package.json", () => {
  const deps = getDepsFromPackageJson(pathToJson)

  expect(deps).toEqual({
    "eslint": "^4.11.0",
    "eslint-plugin-node": "^6.0.1",
    "jest": "22.x.x",
    "mockdate": "^2.0.1",
    "prettier": "1.7.0",
    "child-process-promise": "^2.2.0",
    "commander": "^2.15.1",
    "detox-server": "^7.0.0",
    "fs-extra": "^4.0.2",
    "get-port": "^2.1.0",
    "ini": "^1.3.4",
    "lodash": "^4.17.5",
    "minimist": "^1.2.0",
    "npmlog": "^4.0.2",
    "proper-lockfile": "^3.0.2",
    "shell-utils": "^1.0.9",
    "tail": "^1.2.3",
    "telnet-client": "0.15.3",
    "tempfile": "^2.0.0",
    "ws": "^1.1.1"
  }) 
})

test("should get a package's list of releases", () => {
  const packageName = "detox"
  const releaseTimes = getReleaseTimes(packageName)

  expect(releaseTimes).toEqual(detoxReleaseTimes);
})

test("should resolve the dependency's version", () => {
  const datetime = "2017-05-25"
  const semver = "5.x"
  const version = resolveDependencyVersion(datetime, semver, detoxReleaseTimes)

  expect(version).toEqual("5.0.9");
});

test("should resolve all dependencies' versions from package.json for a given timestamp", () => {
  const timestamp = '2018-07-01'
  const deps = _.pick(getDepsFromPackageJson(pathToJson), ["eslint", "eslint-plugin-node"])

  const versionsAtTimestamp = getVersionsAtTimestamp(deps, timestamp)

  expect(versionsAtTimestamp).toEqual({
    "eslint": "4.19.1",
    "eslint-plugin-node": "6.0.1",
  })
})