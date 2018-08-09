const path = require("path")
const fs = require("fs")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

const getPackageJsonFromGitAt = async (gitDir, date) => {
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

  const cmd = `cd ${gitDir} && git log --format=format:%H --before="${date.unix()}" -1`
  const { stdout: lastCommitBeforeTimestamp } = await exec(cmd, {
    encoding: "utf8"
  })

  if (!lastCommitBeforeTimestamp) {
    throw new Error(`There are no commits before ${date.toString()}`)
  }

  const { stdout: packageJson } = await exec(
    `cd ${gitDir} && echo \`git show ${lastCommitBeforeTimestamp}:./package.json\``
  )

  if (!packageJson) {
    throw new Error(
      `Failed finding a package.json file on ${date.toString()} in the repo at ${gitDir}`
    )
  }

  return Promise.resolve(JSON.parse(packageJson))
}

const getPackageJsonDependencies = fieldName => async (gitDir, date) => {
  return (await getPackageJsonFromGitAt(gitDir, date))[fieldName]
}

const getDependencySemvers = getPackageJsonDependencies("dependencies")
const getDevDependencySemvers = getPackageJsonDependencies("devDependencies")

module.exports = {
  getDependencySemvers,
  getDevDependencySemvers
}
