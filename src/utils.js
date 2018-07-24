// @flow
const _ = require("lodash")
const { execSync } = require('child_process') 
const fs = require("fs")
const dayjs = require("dayjs")
const semver = require("semver")

/*::
type InfoField = "dependencies" | "devDependencies" | "time"
*/

const getRegistryInfoField = ({
  moduleName,
  fieldName, 
}
/*: {
  moduleName :string,
  fieldName :InfoField,
}*/ 
) /*: ?{[string]: string} */=> {
  const cmd = `npm view --json ${moduleName} ${fieldName}`
  try {
    const fieldStr = execSync(cmd, {encoding: "utf8"})
    const field = JSON.parse(fieldStr)
    return field
  } catch (e) {
    return null
  }
}

module.exports = {
  getRegistryInfoField
}