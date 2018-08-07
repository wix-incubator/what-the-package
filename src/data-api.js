const path = require("path")
const fs = require("fs")
const _ = require("lodash")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

const { resolveVersion } = require("./utils")

const getVersionToReleaseTime = async npmModuleName => {
  const cmd = `npm view --json ${npmModuleName} time`
  const { stderr, stdout } = await exec(cmd, { encoding: "utf8" })

  if (!_.isEmpty(stderr)) {
    return JSON.parse(stderr)
  } else {
    return _.isEmpty(stdout) ? {} : JSON.parse(stdout)
  }
}

const getPackageJsonFromGitAt = async (timestamp, gitDir) => {
  const gitDirPath = path.resolve(gitDir, ".git")
  const pjPath = path.resolve(gitDir, "package.json")

  const errors = []
  if (!fs.existsSync(gitDirPath)) {
    errors.push(`Couldn't find a git repository at ${gitDir}`)
  }
  if (!fs.existsSync(pjPath)) {
    errors.push(`Couldn't find package.json at ${pjPath}`)
  }
  if (errors.length > 0) {
    throw new Error(errors.join(", "))
  }

  const cmd = `cd ${gitDir} && git log --format=format:%H --before="${timestamp}" -1`
  const {stdout: lastCommitBeforeTimestamp} = await exec(cmd, {encoding: "utf8"})

  if (!lastCommitBeforeTimestamp) {
    throw new Error(
      `There are no commits before ${timestamp}`
    )
  }

  const {stdout: packageJson} = await exec(`cd ${gitDir} && echo \`git show ${lastCommitBeforeTimestamp}:./package.json\``)

  if (!packageJson) {
    throw new Error(
      `Failed finding a package.json file on ${timestamp} in the repo at ${gitDir}`
    )
  }

  return Promise.resolve(JSON.parse(packageJson))
}

const getPackageJsonDependencies = fieldName => async (timestamp, gitDir) => {
  return (await getPackageJsonFromGitAt(timestamp, "../wix-base-ui"))[fieldName]
}

const getRegistryInfoField = fieldName => async (npmModuleName, timestamp) => {
  const versionToReleaseTime = await getVersionToReleaseTime(npmModuleName)
  const version = resolveVersion(versionToReleaseTime, timestamp, "x")

  const cmd = `npm view --json ${npmModuleName}@${version} ${fieldName}`
  const { stderr, stdout } = await exec(cmd, { encoding: "utf8" })

  if (!_.isEmpty(stderr)) {
    return JSON.parse(stderr)
  } else {
    return _.isEmpty(stdout) ? {} : JSON.parse(stdout)
  }
}

const getDependencySemvers = getPackageJsonDependencies("dependencies")
const getDevDependencySemvers = getPackageJsonDependencies("devDependencies")

// const getDependencySemvers = getRegistryInfoField("dependencies")
// const getDevDependencySemvers = getRegistryInfoField("devDependencies")
const getReleaseTimes = getVersionToReleaseTime

module.exports = {
  getDependencySemvers,
  getDevDependencySemvers,
  getReleaseTimes,
  getPackageJsonFromGitAt,
  getPackageJsonDependencies
}
