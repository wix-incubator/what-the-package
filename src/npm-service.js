const _ = require("lodash")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

const view = async ({moduleName, version = '', fieldName = ''}) => {
  const cmd = `npm view --json ${moduleName}@${version} ${fieldName}`
  return exec(cmd, {encoding: "utf8"})
}

const getPackageReleases = async moduleName => {
  const {stderr, stdout} = await view({
    moduleName,
    fieldName: 'time'
  })

  // TODO discuss this check
  if (!_.isEmpty(stderr)) {
    return JSON.parse(stderr)
  } else {
    return _.isEmpty(stdout) ? {} : JSON.parse(stdout)
  }
}

module.exports = {
  view,
  getPackageReleases
}
