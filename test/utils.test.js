const {
  time: DETOX_VERSION_TO_RELEASE_TIME
} = require("../data/npm-view-detox-8.json")
const moment = require("moment")

const { compareNameToVersionMaps, resolveVersion } = require("../src/utils")

describe("compareNameToVersionMaps", () => {
  test("should be correct", () => {
    const priorVersions = {
      "package-A": "5",
      "package-B": "5",
      "package-C": "5"
    }
    const latterVersions = {
      "package-B": "5",
      "package-C": "17",
      "package-D": "6"
    }

    const versionsComparison = compareNameToVersionMaps(
      priorVersions,
      latterVersions
    )

    expect(versionsComparison).toEqual([
      {
        packageName: "package-A",
        priorVersion: "5",
        latterVersion: null
      },
      {
        packageName: "package-B",
        priorVersion: "5",
        latterVersion: "5"
      },
      {
        packageName: "package-C",
        priorVersion: "5",
        latterVersion: "17"
      },
      {
        packageName: "package-D",
        priorVersion: null,
        latterVersion: "6"
      }
    ])
  })
})

describe("resolveVersion", () => {
  test("should return the latest version", () => {
    const semver = "x"
    const date = moment(DETOX_VERSION_TO_RELEASE_TIME["7.0.1"]).subtract(
      -1,
      "millisecond"
    )
    const version = resolveVersion(DETOX_VERSION_TO_RELEASE_TIME, date, semver)

    expect(version).toEqual("7.0.1")
  })

  test("should return the latest version matching the semver", () => {
    const semver = "7.0.x"
    const date = moment(DETOX_VERSION_TO_RELEASE_TIME["7.3.0"]).subtract(
      -1,
      "millisecond"
    )
    const version = resolveVersion(DETOX_VERSION_TO_RELEASE_TIME, date, semver)

    expect(version).toEqual("7.0.1")
  })

  test("should ignore versions with tags", () => {
    const semver = "x"
    const timestamp = moment(
      DETOX_VERSION_TO_RELEASE_TIME["7.0.0-alpha.1"]
    ).subtract(-1, "millisecond")
    const version = resolveVersion(
      DETOX_VERSION_TO_RELEASE_TIME,
      timestamp,
      semver
    )

    expect(version).toEqual("6.0.4")
  })

  test("should return null if no version satisfies semver", () => {
    const semver = "6.3.x"
    const date = moment(DETOX_VERSION_TO_RELEASE_TIME["7.0.0"]).subtract(
      -1,
      "millisecond"
    )
    const version = resolveVersion(DETOX_VERSION_TO_RELEASE_TIME, date, semver)

    expect(version).toBeNull()
  })

  test("should return null if no version was released before date", () => {
    const semver = "x"
    const date = moment(DETOX_VERSION_TO_RELEASE_TIME["created"]).subtract(
      1,
      "millisecond"
    )
    const version = resolveVersion(DETOX_VERSION_TO_RELEASE_TIME, date, semver)

    expect(version).toBeNull()
  })
})
