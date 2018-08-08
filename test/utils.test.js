const {
  time: DETOX_VERSION_TO_RELEASE_TIME
} = require("../data/npm-view-detox-8.json")

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
    const timestamp =
      new Date(DETOX_VERSION_TO_RELEASE_TIME["7.0.1"]).valueOf() + 1
    const version = resolveVersion(
      DETOX_VERSION_TO_RELEASE_TIME,
      timestamp,
      semver
    )

    expect(version).toEqual("7.0.1")
  })

  test("should return the latest version matching the semver", () => {
    const semver = "7.0.x"
    const timestamp =
      new Date(DETOX_VERSION_TO_RELEASE_TIME["7.3.0"]).valueOf() + 1
    const version = resolveVersion(
      DETOX_VERSION_TO_RELEASE_TIME,
      timestamp,
      semver
    )

    expect(version).toEqual("7.0.1")
  })

  test("should ignore versions with tags", () => {
    const semver = "x"
    const timestamp =
      new Date(DETOX_VERSION_TO_RELEASE_TIME["7.0.0-alpha.1"]).valueOf() + 1
    const version = resolveVersion(
      DETOX_VERSION_TO_RELEASE_TIME,
      timestamp,
      semver
    )

    expect(version).toEqual("6.0.4")
  })

  test("should return null if no version satisfies semver", () => {
    const semver = "6.3.x"
    const timestamp =
      new Date(DETOX_VERSION_TO_RELEASE_TIME["7.0.0"]).valueOf() + 1
    const version = resolveVersion(
      DETOX_VERSION_TO_RELEASE_TIME,
      timestamp,
      semver
    )

    expect(version).toBeNull()
  })

  test("should return null if no version was released before timestamp", () => {
    const semver = "x"
    const timestamp =
      new Date(DETOX_VERSION_TO_RELEASE_TIME["created"]).valueOf() - 1
    const version = resolveVersion(
      DETOX_VERSION_TO_RELEASE_TIME,
      timestamp,
      semver
    )

    expect(version).toBeNull()
  })
})
