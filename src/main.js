const fs = require("fs")

const getDepsFromPackageJson = path => {
  const pj = fs.readFileSync(path, "utf8")
  const parsedPj = JSON.parse(pj)
  const deps = {...parsedPj.dependencies, ...parsedPj.devDependencies}
  return deps
}

module.exports = {
  getDepsFromPackageJson
}


