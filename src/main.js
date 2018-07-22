const _ = require("lodash")
const { execSync } = require('child_process') 
const fs = require("fs")

const getDepsFromPackageJson = path => {
  const pj = fs.readFileSync(path, "utf8")
  const parsedPj = JSON.parse(pj)
  const deps = {...parsedPj.dependencies, ...parsedPj.devDependencies}
  return deps
}

const getReleaseTimes = packageName => {
  const semverRegex = /^\d+\.\d+\.\d+$/
  const cmd = `npm view --json ${packageName} time`
  const viewJson = execSync(cmd, {encoding: "utf8"})
  const view = JSON.parse(viewJson)
  const semverOnly = _.pickBy(view, (v, k) => semverRegex.test(k))
  return semverOnly
}

module.exports = {
  getDepsFromPackageJson,
  getReleaseTimes
}


