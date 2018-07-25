const {
  compareNpmModuleDependencies,
  getExactDependencyVersionsAt,
  getExactVersion,
  getRegistryInfoField,
  getVersionsComparison,
  getVersionsDiff,
} = require("../src/utils")

const detoxRegistryInfo = require("../data/npm-view-detox-8.json")

const {
  dependencies: DETOX_DEPENDENCIES,
  devDependencies: DETOX_DEV_DEPENDENCIES,
  name: DETOX_NAME,
  time: DETOX_TIME,
  version: DETOX_VERSION
} = detoxRegistryInfo

const NON_EXISTING_PACKAGE_NAME = "if_this_packages_exists_then_our_build_deserves_to_break_111111oneoneone"

describe("getRegistryInfoField", () => {
  test("should return correct dependencies", () => {
    const moduleName = `${DETOX_NAME}@${DETOX_VERSION}`
    const fieldName = "dependencies"
    const actual = getRegistryInfoField(moduleName, fieldName)
    
    expect(actual).toEqual(DETOX_DEPENDENCIES)
  })

  test("should return correct devDependencies", () => {
    const moduleName = `${DETOX_NAME}@${DETOX_VERSION}`
    const fieldName = "devDependencies"
    const actual = getRegistryInfoField(moduleName, fieldName)
    
    expect(actual).toEqual(DETOX_DEV_DEPENDENCIES)
  })

  test("should return correct release times", () => {
    const moduleName = `${DETOX_NAME}@${DETOX_VERSION}`
    const fieldName = "time"
    const actual = getRegistryInfoField(moduleName, fieldName)
    
    expect(actual).toEqual(DETOX_TIME)
  })

  test("should return null for non-existing package", () => {
    const moduleName = NON_EXISTING_PACKAGE_NAME
    const fieldName = "time"
    const actual = getRegistryInfoField(moduleName, fieldName)
    
    expect(actual).toEqual(null)
  })

  test("should return null for non-existing field", () => {
    const moduleName = DETOX_NAME
    const fieldName = "if_this_field_exists_then_our_build_deserves_to_break_111111oneoneone"
    const actual = getRegistryInfoField(moduleName, fieldName)
    
    expect(actual).toEqual(null)
  })
})

describe("getExactVersion", () => {
  test("should return the latest version", () => {
    const npmModuleName = DETOX_NAME
    const semver = "x"
    const timestamp = (new Date(DETOX_TIME["7.0.1"])).valueOf() + 1

    const version = getExactVersion(npmModuleName, timestamp, semver)
    expect(version).toEqual("7.0.1")
  })

  test("should return the latest version matching the semver", () => {
    const npmModuleName = DETOX_NAME
    const semver = "7.0.x"
    const timestamp = (new Date(DETOX_TIME["7.3.0"])).valueOf() + 1

    const version = getExactVersion(npmModuleName, timestamp, semver)
    expect(version).toEqual("7.0.1")
  })
  
  test("should ignore versions with tags", () => {
    const npmModuleName = DETOX_NAME
    const semver = "x"
    const timestamp = (new Date(DETOX_TIME["7.0.0-alpha.1"])).valueOf() + 1

    const version = getExactVersion(npmModuleName, timestamp, semver)
    expect(version).toEqual("6.0.4")
  })

  test("should return null if no version satisfies semver", () => {
    const npmModuleName = DETOX_NAME
    const semver = "6.3.x"
    const timestamp = (new Date(DETOX_TIME["7.0.0"])).valueOf() + 1

    const version = getExactVersion(npmModuleName, timestamp, semver)
    expect(version).toEqual(null)
  })

  test("should return null if no version was released before timestamp", () => {
    const npmModuleName = DETOX_NAME
    const semver = "x"
    const timestamp = (new Date(DETOX_TIME["created"])).valueOf() - 1

    const version = getExactVersion(npmModuleName, timestamp, semver)
    expect(version).toEqual(null)
  })

  test("should return null if package doesn't exist", () => {
    const npmModuleName = NON_EXISTING_PACKAGE_NAME
    const semver = "x"
    const timestamp = (new Date(DETOX_TIME["7.0.0"])).valueOf() + 1

    const version = getExactVersion(npmModuleName, timestamp, semver)
    expect(version).toEqual(null)
  })
})

describe("getExactDependencyVersionsAt", () => {
  test("should return correct result", () => {
    const npmModuleName = `${DETOX_NAME}`
    const timestamp = (new Date(DETOX_TIME["2.0.0"])).valueOf() + 1

    const result = getExactDependencyVersionsAt(npmModuleName, timestamp)
    expect(result).toEqual({
      "babel-cli": "6.10.1",
      "babel-core": "6.9.1",
      "babel-eslint": "6.0.4",
      "babel-polyfill": "6.9.1",
      "babel-preset-es2015": "6.9.0",
      "babel-preset-react": "6.5.0",
      "babel-preset-stage-0": "6.5.0",
      "babel-register": "6.9.0",
    })
  })
})

describe("getVersionsComparison", () => {
  test("should be correct", () => {
    const priorVersions = {
      "package-A": "5",
      "package-B": "5",
      "package-C": "5",
    };
    const latterVersions = {
      "package-B": "5",
      "package-C": "17",
      "package-D": "6",
    };

    const versionsComparison = getVersionsComparison(priorVersions, latterVersions)

    expect(versionsComparison).toEqual({
      "package-A": {
        "priorVersion": "5",
        "latterVersion": null,
      },
      "package-B": {
        "priorVersion": "5",
        "latterVersion": "5",
      },
      "package-C": {
        "priorVersion": "5",
        "latterVersion": "17",
      },
      "package-D": {
        "priorVersion": null,
        "latterVersion": "6",
      },
    })
  })
})

describe.skip("getVersionsDiff", () => {
  test("should return only versions that changed", () => {
    const priorVersions = {
      "babel-cli": "6.10.1",
      "babel-core": "6.9.1",
      "babel-eslint": "6.0.4",
    };
    const latterVersions = {
      "babel-cli": "6.10.1",
      "babel-core": "7.0.0",
      "babel-polyfill": "6.9.1",
    };

    const diff = getVersionsDiff(priorVersions, latterVersions)

    expect(diff).toEqual({
      "babel-core": {
        "latterVersion": "7.0.0",
        "priorVersion": "6.9.1",
      },
      "babel-eslint": {
        "latterVersion": null,
        "priorVersion": "6.0.4",
      },
      "babel-polyfill": {
        "latterVersion": "6.9.1",
        "priorVersion": null,
      },
    })
  })
})

describe("compareNpmModuleDependencies", () => {
  test("should calculate dependecy diff for detox module", () => {
    const npmModuleName = DETOX_NAME
    const priorTimestamp = (new Date(DETOX_TIME["7.0.0"])).valueOf() + 1
    const latterTimestamp = (new Date(DETOX_TIME["8.0.0"])).valueOf() + 1

    const result = compareNpmModuleDependencies(
      npmModuleName,
      priorTimestamp,
      latterTimestamp
    )

    expect(result).toEqual(false)
  })

  test("should throw if latter is before prior", () => {
    const npmModuleName = DETOX_NAME
    const invalidPriorTimestamp = (new Date(DETOX_TIME["8.0.0"])).valueOf()
    const invalidLatterTimestamp = (new Date(DETOX_TIME["2.0.0"])).valueOf()

    expect(() => compareNpmModuleDependencies(
      npmModuleName,
      invalidPriorTimestamp,
      invalidLatterTimestamp
    )).toThrow()
  })

  test("should return null if something went wrong", () => {
    const npmModuleName = "a-non-existent-package---what-are-the-odds-there-will-be"
    const priorTimestamp = (new Date(DETOX_TIME["7.0.0"])).valueOf()
    const latterTimestamp = (new Date(DETOX_TIME["8.0.0"])).valueOf()

    const result = compareNpmModuleDependencies(
      npmModuleName,
        priorTimestamp,
      latterTimestamp
    )

    expect(result).toBeNull()
  })

})
