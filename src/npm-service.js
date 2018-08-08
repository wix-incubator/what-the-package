const _ = require("lodash")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

const view = async ({moduleName, version = '', fieldName = ''}) => {
  const cmd = `npm view --json ${moduleName}@${version} ${fieldName}`

  const {stderr, stdout} = await exec(cmd, {encoding: "utf8"})

  if (!_.isEmpty(stderr)) {
    throw new Error(stderr)
  } else {
    return _.isEmpty(stdout) ? stdout : JSON.parse(stdout)
  }
}

const getPackageReleases = async (moduleName) => {
  return view({
    moduleName,
    fieldName: 'time'
  })
}

module.exports = {
  view,
  getPackageReleases
}
